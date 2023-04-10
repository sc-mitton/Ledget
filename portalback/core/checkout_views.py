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
from django.conf import settings
from django.contrib.auth import get_user_model
import stripe

from core.models import (
    Customer,
    Price,
    Subscription
)
from core.serializers import (
    SubscriptionSerializer,
    PriceSerializer
)

import threading
import logging

stripe.api_key = settings.STRIPE_SK
endpoint_secret = settings.STRIPE_ENDPOINT_SECRET_TEST
stripe_logger = logging.getLogger('core.stripe')


class PriceView(ListAPIView):
    """Class for getting the list of prices from Stripe"""
    permission_classes = [IsAuthenticated]
    queryset = Price.objects.all().filter(active=True)
    serializer_class = PriceSerializer


class SubscriptionView(CreateAPIView):
    """Class for handling the subscription creation and updating"""
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            stripe_subscription = serializer.save()
        except stripe.error.InvalidRequestError as e:
            return Response(
                data={'error': str(e)},
                status=HTTP_400_BAD_REQUEST,
                content_type='application/json'
            )

        data = {
            'client_secret':
            stripe_subscription.latest_invoice.payment_intent.client_secret
        }
        return Response(
            data,
            status=HTTP_200_OK,
            content_type='application/json'
        )


class StripeHookView(APIView):
    """Class for handling the Stripe webhook"""

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
            return Response(status=HTTP_400_BAD_REQUEST)
        except ValueError as e:
            print('⚠️  Invalid payload' + str(e))
            return Response(status=HTTP_400_BAD_REQUEST)

        # Handle the event
        t = threading.Thread(
            target=self.dispatch_handle_event,
            args=(event,)
        )
        t.start()

        return Response(status=HTTP_200_OK)

    def dispatch_handle_event(self, event):
        ignore_events = [
            'invoice_created', 'invoice_updated', 'invoice_payment_succeeded',
            'payment_method_attached', 'setup_intent_created'
        ]

        event_type = event.type.replace('.', '_')
        handler = getattr(self, f"handle_{event_type}", None)
        if handler:
            handler(event)
        if not handler and event_type not in ignore_events:
            stripe_logger.info(f"No handler for event type: {event.type}")

    # Create handlers
    def handle_customer_created(self, event):
        """Create corresponding customer in our database."""

        data = event.data.object
        user = get_user_model().objects.filter(
            email=event.data.object.email
        ).first()
        customer = Customer.objects.create(
            user=user,
            id=data.id,
            first_name=data.name,
            last_name=data.name,
            city=data.address.city,
            state=data.address.state,
            postal_code=data.address.postal_code,
            country=data.address.country,
            delinquent=data.delinquent,
            created=data.created,
        )
        customer.save()

    def handle_customer_subscription_created(self, event):
        """Create corresponding subscription in our database."""

        data = event.data.object
        subscription = Subscription.objects.create(
            id=data.id,
            customer=Customer.objects.get(id=data.customer),
            price=Price.objects.get(id=data.items.data[0].price.id),
            current_period_end=data.current_period_end,
            status=data.status,
            cancel_at_period_end=data.cancel_at_period_end,
            default_payment_method=data.default_payment_method,
            created=data.created,
            trial_start=data.trial_start,
            trial_end=data.trial_end,
        )
        subscription.save()

    # Update handlers
    def update_instance(self, instance, changing_data):
        """Generic method for updating the data in the db with
        the data from Stripe."""

        for field in changing_data.keys():
            if hasattr(instance, field):
                setattr(instance, field, changing_data[field])
        instance.save()

    def get_changing_data(self, data):
        """Parce the data from Stripe and return the dict
        of data that is being updated."""

        changing_fields = data.previous_attributes.keys()

        changing_data = {}
        for field in changing_fields:
            changing_data[field] = data.object[field]

        return changing_data

    def handle_customer_updated(self, event):
        """Update corresponding customer in our database."""

        data = event.data.object
        changing_data = self.get_changing_data(data)
        customer = Customer.objects.get(id=data.id)
        self.update_instance(customer, changing_data)

    def handle_customer_subscription_updated(self, event):
        """Update corresponding subscription in our database."""

        data = event.data.object
        changing_data = self.get_changing_data(data)
        subscription = Subscription.objects.get(id=data.id)
        self.update_instance(subscription, changing_data)

    # Setup Intent handlers
    def handle_setup_intent_succeeded(self, event):
        """Provision the service for the user."""

        user = get_user_model().objects.get(
            customer__id=event.data.object.customer
        )
        user.provision_service = True
        user.save()
