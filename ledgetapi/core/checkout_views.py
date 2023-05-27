from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
)
from rest_framework.exceptions import APIException
from django.conf import settings
from django.contrib.auth import get_user_model
import stripe

import time
from datetime import timedelta
import threading
import logging

from core.models import (
    Customer,
    Price,
    Subscription
)
from core.serializers import (
    CreateSubscriptionSerializer,
    PriceSerializer,
    CustomerSerializer
)


stripe.api_key = settings.STRIPE_SK
endpoint_secret = settings.STRIPE_ENDPOINT_SECRET_TEST
stripe_logger = logging.getLogger('core.stripe')


class PriceView(ListAPIView):
    """Class for getting the list of prices from Stripe"""
    queryset = Price.objects.all().filter(active=True)
    serializer_class = PriceSerializer


class CreateCustomerView(CreateAPIView):
    serializer_class = CustomerSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.create_customer()
        except stripe.error.InvalidRequestError as e:
            return Response(
                data={'error': str(e)},
                status=HTTP_400_BAD_REQUEST,
                content_type='application/json'
            )

        response = Response(
            status=HTTP_200_OK,
            content_type='application/json'
        )

        return response


class SubscriptionView(CreateAPIView):
    """Class for handling the subscription creation and updating"""
    permission_classes = [IsAuthenticated]
    serializer_class = CreateSubscriptionSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        stripe_subscription = serializer.create_subscription()
        return Response(
            {'client_secret':
                stripe_subscription.pending_setup_intent.client_secret},
            status=HTTP_200_OK,
            content_type='application/json'
        )


class StripeHookView(APIView):
    """Class for handling the Stripe webhook"""
    grace_period = timedelta(days=1).total_seconds()

    def post(self, request, *args, **kwargs):

        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']

        event = None
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook signature verification failed.' + str(e))
            response = Response(status=HTTP_400_BAD_REQUEST)
        except ValueError as e:
            print('⚠️  Invalid payload' + str(e))
            response = Response(status=HTTP_400_BAD_REQUEST)
        else:
            response = Response(status=HTTP_200_OK)

        # Handle the event
        if event:
            t = threading.Thread(
                target=self.dispatch_event,
                args=(event,)
            )
            t.start()

        return response

    def dispatch_event(self, event):

        event_type = event.type.replace('.', '_')
        handler = getattr(self, f"handle_{event_type}", None)
        if not handler:
            return

        for i in range(1, 4):
            try:
                handler(event)
                break
            except Exception as e:
                stripe_logger.error(
                    f"⚠️ Attempt {i} for {event_type} handler: {e}"
                )
                time.sleep(1)

    # Update handlers/helpers
    def update_instance(self, instance, new_values):
        """Generic method for updating the data in the db with
        the data from Stripe."""

        for field in new_values.keys():
            if hasattr(instance, field):
                setattr(instance, field, new_values[field])
        instance.save()

    def extract_new_values(self, object, previous_attributes):
        """Recurse through the object and extract the new values."""

        new_values = {}
        for key, value in object.items():
            if key in previous_attributes:
                new_values[key] = value
            elif isinstance(value, dict):
                new_values.update(
                    self.extract_new_values(value, previous_attributes)
                )

        return new_values

    def handle_customer_updated(self, event):
        """Update corresponding customer in our database."""

        object = event.data.object
        new_values = self.extract_new_values(
            object,
            event.data.previous_attributes
        )
        customer = Customer.objects.get(id=object.id)
        self.update_instance(customer, new_values)

    def handle_customer_subscription_updated(self, event):
        """Update corresponding subscription in our database."""

        object = event.data.object
        new_values = self.extract_new_values(
            object,
            event.data.previous_attributes
        )

        subscription = Subscription.objects.get(id=object.id)
        self.update_instance(subscription, new_values)

    # Setup Intent handlers
    def handle_setup_intent_succeeded(self, event):
        """Provision the service for the customer. This is done
        by setting the timestamp for when the user will have service
        until."""
        customer = Customer.objects.get(id=event.data.object.customer)
        trial_length_seconds = timedelta(
            customer.subscription.price.trial_period_days
        ).total_seconds()

        customer.service_expiration = \
            int(time.time()) + trial_length_seconds + self.grace_period
        customer.save()

    # Delete Handlers
    def handle_customer_deleted(self, event):
        """Delete the customer in the db."""
        try:
            customer = Customer.objects.get(id=event.data.object.id)
            user = get_user_model().objects.get(
                customer__id=customer.id
            )
            user.provision_service = False
            customer.delete()
            stripe_logger.info(
                f"🗑 Deleted customer: {event.data.object.id}"
            )
            user.save()
        except Customer.DoesNotExist:
            stripe_logger.error(
                f"⚠️ Can't delete customer: {event.data.object.id}, "
                "does not exist."
            )
        except get_user_model().DoesNotExist:
            stripe_logger.error(
                f"⚠️ Can't update user: {event.data.object.id}, "
                "does not exist."
            )

    def handle_customer_subscription_deleted(self, event):
        try:
            subscription = Subscription.objects.get(id=event.data.object.id)
            subscription.delete()
            stripe_logger.info(
                f"🗑 Deleted subscription: {event.data.object.id}"
            )
        except Subscription.DoesNotExist:
            stripe_logger.error(
                f"⚠️ Can't delete subscription: {event.data.object.id}, "
                "does not exist."
            )

    # Invoice handlers
    def handle_invoice_paid(self, event):
        """Update the service expiration for the customer."""
        customer = Customer.objects.get(id=event.data.object.customer)
        customer.service_expiration = \
            event.data.object.period_end + self.grace_period
        customer.save()

    def handle_invoice_payment_failed(self, event):
        """Update the service expiration for the customer."""
        customer = Customer.objects.get(id=event.data.object.customer)
        customer.service_expiration = int(time.time()) - 1
        customer.save()

    # TODO
    #   customer.subscription.paused *
    #   customer.subscription.resumed *
