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
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
import stripe

from core.models import Customer, Account
from financials.models import PlaidItem
from hooks.permissions import CameFromOry, CameFromPlaid
from financials.views.transactions import sync_transactions
from budget.models import Category
from hooks.tasks import cleanup_stripe_webhook_tests

stripe_logger = logging.getLogger('stripe')
stripe.api_key = settings.STRIPE_API_KEY
stripe_webhook_secret = settings.STRIPE_WEBHOOK_SECRET
plaid_logger = logging.getLogger('plaid')


class StripeHookView(APIView):  # pragma: no cover
    """
    Class for handling the Stripe webhook. All webhooks
    are idempotent as they are coded.
    """

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

    # Create Handlers
    def handle_customer_created(self, event):
        '''
        Only used for testing
        '''

        if event.livemode:
            raise ValueError('Webhook is only used for testing')

        account = Account.objects.create()

        user = get_user_model().objects.create(account=account)
        cleanup_stripe_webhook_tests.apply_async(args=[str(user.id)], countdown=12)

        customer = Customer.objects.create(
            user=user,
            id=event.data.object.id,
            subscription_status=Customer.SubscriptionStatus.TRIALING
        )
        customer.account = account
        customer.save()

    # Delete Handlers
    def handle_customer_deleted(self, event):
        customer = Customer.objects.get(id=event.data.object.id)
        customer.delete()

    def handle_customer_subscription_deleted(self, event):
        # This is a permanent cancelation, and all of the user's data is
        # going to be deleted. The end of the billing period has been reacehd
        # and the user has not reactivated, so it's time to take out the trash

        try:
            customer_id = event.data.object.customer
            customer = Customer.objects.get(id=customer_id)
        except ObjectDoesNotExist:
            return  # Customer already deleted and we don't need to do anything

        customer.subscription_status = Customer.SubscriptionStatus.DELETED
        customer.save()

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
            self.create_objects(request)
        except Exception as e:
            return Response(data={'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)

    @transaction.atomic
    def create_objects(self, request):
        '''
        Create a user to match the Ory user and a default
        category for the user.
        '''

        # Create account
        account = Account.objects.create()

        # Create user
        new_user = {'id': request.data['user_id']}
        if request.data.get('is_verified', False):
            new_user['is_verified'] = True
        user = get_user_model().objects.create_user(**new_user, account=account)

        # Create default category
        default_category = Category.objects.create(
            name='miscellaneous',
            emoji='🪣',
            is_default=True)
        default_category.users.add(user)


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


class PlaidItemHook:

    def handle_error(self, item, data):

        if data.get('error', {}).get('error_code', None) == 'ITEM_LOGIN_REQUIRED':
            item.login_required = True
            item.save()

    # Plaid Item hooks
    def handle_login_repared(self, item, data):
        item.login_required = False
        item.pending_expiration = False
        item.save()

    def handle_new_account_available(self, item, data):
        item.new_account_available = True
        item.save()

    def handle_user_permission_revoked(self, item, data):
        item.permission_revoked = True
        item.save()

    def handle_pending_expiration(self, item, data):
        item.pending_expiration = True
        item.save()

    def handle_webook_update_acknolwedged(self, item, data):
        pass

    def handle_session_finished(self, item, data):
        pass

    # Transaction hooks
    def handle_transactions_removed(self, item, data):
        '''
        This is an old hook for transactions/get,
        handle_sync_updates_available is the new version
        '''
        pass

    def handle_initial_update_complete(self, item, data):
        self.handle_sync_updates_available(item, data)

    def handle_sync_updates_available(self, item, data):
        '''
        Handles syncing the transactions for a given plaid item.
        This also takes care of making sure all transactions are synced
        when new items are initially added (initial_update_complete is
        passed in post).
        '''
        plaid_item = PlaidItem.objects.get(id=item.id)
        sync_transactions(plaid_item)


class PlaidItemHookView(APIView, PlaidItemHook):
    """Plaid webhook"""

    permission_classes = [CameFromPlaid]

    def post(self, request, *args, **kwargs):
        item = self.get_item(request.data["item_id"])
        handler = self.get_handler(request.data["webhook_code"])

        if not handler or not item:
            plaid_logger.error(
                f"Missing handler or item for webhook {request.data['webhook_code']}"
            )
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            handler(item, request.data)
        except Exception as e:
            plaid_logger.error(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)

    def get_handler(self, webhook_code):
        handle_root = webhook_code.lower()
        return getattr(self, f"handle_{handle_root}", None)

    def get_item(self, id):
        try:
            return PlaidItem.objects.get(id=id)
        except ObjectDoesNotExist:
            return None
