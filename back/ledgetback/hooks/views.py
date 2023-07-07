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
from django.core.exceptions import ObjectDoesNotExist
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
            except ObjectDoesNotExist as e:
                stripe_logger.error(
                    f"⚠️ ObjectDoesNotExist for {event_type} handler: {e}"
                )
                break
            except Exception as e:
                stripe_logger.error(
                    f"⚠️ Attempt {i} for {event_type} handler: {e}"
                )
                time.sleep(1)

    # Setup Intent handlers
    def handle_setup_intent_succeeded(self, event):
        print(event.data.object)
        print(event)
        customer = Customer.objects.get(id=event.data.object.customer)
        customer.subscription_status = Customer.TRIALING
        # TODO update the provisioning, add the trial period in seconds
        # (add 1 day for buffer) to the current unix timestampe
        customer.save()

    def handle_setup_intent_setup_failed(self, event):
        customer = Customer.objects.get(id=event.data.object.customer)
        customer.subscription_status = Customer.INCOMPLETE
        customer.save()

    # Delete Handlers
    def handle_customer_deleted(self, event):
        customer = Customer.objects.get(id=event.data.object.id)
        customer.delete()

    # Events that change subscription status
    def handle_customer_subscription_paused(self, event):
        customer = Customer.objects.get(id=event.data.object.customer)
        customer.subscription_status = Customer.PAUSED
        customer.provisioned_until = 0
        customer.save()

    def handle_customer_subscription_deleted(self, event):
        # Reverts the customer to no subscription (exactly the same as when
        # customer is first created)

        customer = Customer.objects.get(id=event.data.object.customer)
        customer.subscription_status = None
        customer.provisioned_until = 0
        customer.save()

    def handle_customer_subscription_resumed(self, event):
        customer = Customer.objects.get(id=event.data.object.customer)
        customer.subscription_status = Customer.ACTIVE
        # TODO update the provisioning
        customer.save()

    def handle_invoice_paid(self, event):
        customer = Customer.objects.get(id=event.data.object.customer)
        # TODO update the provisioning
        customer.save()

    def handle_invoice_payment_failed(self, event):
        customer = Customer.objects.get(id=event.data.object.customer)
        customer.subscription_status = Customer.PAST_DUE
        # TODO update the provisioning
        customer.save()

    def handle_customer_subscription_updated(self, event):
        """ Event occurs whenever a subscription changes (e.g., switching from
        one plan to another, or changing the status from trial to active). """
        customer = Customer.objects.get(id=event.data.object.customer)
        customer.subscription_status = Customer.ACTIVE
        customer.save()


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
