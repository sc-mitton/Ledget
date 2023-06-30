import logging
import threading
import time

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
)
from django.contrib.auth import get_user_model
from django.db.transaction import atomic
from django.conf import settings
import stripe

from core.models import Customer
from hooks.decorators import ory_api_key_auth

stripe_logger = logging.getLogger('core.stripe')
stripe.api_key = settings.STRIPE_API_KEY
stripe_webhook_secret = settings.STRIPE_WEBHOOK_SECRET


class StripeHookView(APIView):
    """Class for handling the Stripe webhook"""

    def post(self, request, *args, **kwargs):

        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']

        event = None
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, stripe_webhook_secret
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
            # Stripe needs to get a response quick, so we use threads
            t.start()

        return response

    def dispatch_event(self, event):

        event_type = event.type.replace('.', '_')
        handler = getattr(self, f"handle_{event_type}", None)
        if not handler:
            return

        for i in range(3):
            try:
                handler(event)
                break
            except Exception as e:
                stripe_logger.error(
                    f"⚠️ Attempt {i} for {event_type} handler: {e}"
                )
                time.sleep(1)

    # Setup Intent handlers
    def handle_setup_intent_succeeded(self, event):
        """Provision the service for the customer."""

        customer = Customer.objects.get(id=event.data.object.customer)
        customer.subscription_status = Customer.ACTIVE
        # provision service until the end of the billing period
        customer.save()

    # Delete Handlers
    def handle_customer_deleted(self, event):
        """Delete the customer in the db."""
        try:
            customer = Customer.objects.get(id=event.data.object.id)
            customer.delete()
        except Customer.DoesNotExist:
            stripe_logger.error(
                f"⚠️ Can't delete customer: {event.data.object.id}, "
                "does not exist."
            )

    # We need to handle invoice events to extend service provision time

    # We need to handle all of the events that could change
    # the status of the subscription

    # List of events mentioned by Stripe
    # Subscription deleted (make subscription status null)
    # Subscription paused (make subscription status paused)
    # Subscription resumed (make subscription status active)
    # Subscription updated (change provisioning date)
    # Invoice paid (update provisioning date)
    # Invoice payment failed (make subscription status payment_failed)
    # Set up intent succeeded (make subscription status active)


class OryHookView(APIView):
    """Handling the Ory webhook by creating a user and a customer."""

    @ory_api_key_auth
    def post(self, request, *args, **kwargs):
        try:
            self.create_user(request.data['user_id'])
        except Exception as e:
            return Response(data={'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)

    @atomic
    def create_user(self, id):
        get_user_model().objects.create_user(id=id)
