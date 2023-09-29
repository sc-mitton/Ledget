import logging
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
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
import stripe

from core.models import Customer
from financials.models import PlaidItem
from hooks.permissions import CameFromOry, CameFromPlaid

stripe_logger = logging.getLogger('stripe')
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
            stripe_logger.warn(
                '⚠️  Webhook signature verification failed.' + str(e)
            )
            response = Response(status=HTTP_400_BAD_REQUEST)
        except ValueError as e:
            stripe_logger.error('⚠️  Invalid payload' + str(e))
            response = Response(status=HTTP_400_BAD_REQUEST)
        else:
            response = Response(status=HTTP_200_OK)

        self.dispatch_event(event)

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
                time.sleep(1 * i)

    # Delete Handlers
    def handle_customer_deleted(self, event):
        customer = Customer.objects.get(id=event.data.object.id)
        customer.delete()

    def handle_customer_subscription_deleted(self, event):
        # This is a permanent cancelation

        try:
            customer = Customer.objects.get(id=event.data.object.customer)
        except ObjectDoesNotExist:
            return  # Customer already deleted and we don't need to do anything

        customer.delete()

    # Events related to the subscription
    def handle_invoice_paid(self, event):

        lines = event.data.object.lines
        customer = Customer.objects.get(id=event.data.object.customer)
        customer.period_end = lines.data[0].period.end
        customer.save()

    def handle_customer_subscription_updated(self, event):
        """ Event occurs whenever a subscription changes (e.g., switching from
        one plan to another, changing the status from trial to active). """

        customer = Customer.objects.get(id=event.data.object.customer)
        customer.subscription_status = getattr(
            Customer.SubscriptionStatus,
            event.data.object.status.upper()
        )
        customer.save()


class OryRegistrationHook(APIView):
    """Handling the Ory webhook by creating a user and a customer."""
    permission_classes = [CameFromOry]

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


class OrySettingsPasswordHook(APIView):
    """Ory webhook for updating password_last_changed"""
    permission_classes = [CameFromOry]

    def post(self, request, *args, **kwargs):
        try:
            user = get_user_model().objects.get(id=request.data['user_id'])
            user.password_last_changed = timezone.now()
        except Exception as e:
            return Response(data={'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)


class OryVerificationHook(APIView):
    """Ory webhook for updating verification status"""
    permission_classes = [CameFromOry]

    def post(self, request, *args, **kwargs):
        try:
            user = get_user_model().objects.get(id=request.data['user_id'])
            user.is_verified = True
            user.save()
        except Exception as e:
            return Response(data={'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)


class PlaidItemHookView(APIView):
    """Plaid webhook"""
    permission_classes = [CameFromPlaid]

    def post(self, request, *args, **kwargs):
        item = self.get_item(request.data['item_id'])
        handler = self.get_handler(request.data['webhook_code'])

        if not handler or not item:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            handler(item, request.data)

        return Response(status=status.HTTP_200_OK)

    def get_handler(self, webhook_code):
        handle_root = webhook_code.lower()
        return getattr(self, f"handle_{handle_root}", None)

    def get_item(self, id):
        try:
            return PlaidItem.objects.get(id=id)
        except ObjectDoesNotExist:
            return None

    def handle_error(self, item, data):

        if data['error']['error_code'] == 'ITEM_LOGIN_REQUIRED':
            item.login_required = True
            item.save()

    def handle_login_repared(self, item, data):
        item.login_required = False
        item.save()

    def handle_new_account_available(self, item, data):
        item.new_account_available = True
        item.save()

    def handle_permission_revoked(self, item, data):
        item.permission_revoked = True
        item.save()

    def handle_update_acknolwedged(self, item, data):
        pass
