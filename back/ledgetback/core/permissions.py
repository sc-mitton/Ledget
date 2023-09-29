import time
from datetime import datetime
import logging

from rest_framework.permissions import BasePermission
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
import stripe


stripe.api_key = settings.STRIPE_API_KEY
stripe_logger = logging.getLogger('stripe')
logger = logging.getLogger('ledget')


class IsAuthenticated(BasePermission):

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser) \
                or not request.user.is_authenticated:
            return False

        device_aal = getattr(request.user.device, 'aal', None)

        # in reality the device_aal should be at least as high as the session aal
        session_aal = getattr(request.user, 'session_aal', None)

        if request.user.mfa_method == 'totp':
            return device_aal == 'aal2' or session_aal == 'aal2'
        elif request.user.mfa_method == 'otp':
            return device_aal == 'aal15'
        else:
            return device_aal == 'aal1' or device_aal == 'aal2'


class IsAuthedVerifiedSubscriber(IsAuthenticated):
    """Class for bundling permissions for User views"""

    def has_permission(self, request, view):

        checks = [
            request.user.service_provisioned_until > int(time.time()),
            request.user.customer.subscription_not_canceled
        ]

        return super().has_permission(request, view) and all(checks)


class IsObjectOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        try:
            return request.user.id == obj.id or request.user.id == obj.user_id
        except AttributeError:
            return False


class OwnsStripeSubscription(BasePermission):

    def has_permission(self, request, view):
        kwargs = view.kwargs
        try:
            sub_id = self.get_subscription_id(request.user.customer.id)
            return sub_id == kwargs.get('sub_id')
        except Exception as e:
            stripe_logger.error(f'Error checking subscription: {e}')
            return False

    def get_subscription_id(self, customer_id):
        return stripe.Subscription.list(customer=customer_id).data[0].id


class CanCreateStripeSubscription(BasePermission):

    def has_permission(self, request, view):

        checks = [
            request.user.is_customer,
            self.has_no_active_subscription(request.user.customer.id)
        ]

        return all(checks)

    def has_no_active_subscription(self, customer_id):
        '''
        Check if the customer has an active subscription, or
        if they have a subscription that will be canceled at
        the end of the billing period
        '''

        for sub in stripe.Subscription.list(customer=customer_id).data:
            if not sub.cancel_at_period_end:
                return False

        return True


class BaseFreshSessionClass(BasePermission):
    message = 'Required session aal or freshness is not met'

    def check_session_is_fresh(self, request, aal):
        try:
            if aal == 'aal15':
                seconds_since_last_login = self.get_last_aal15_login_delta(request)
            else:
                seconds_since_last_login = self.get_last_ory_login_delta(request, aal)
        except Exception as e:
            logger.error(f'Error checking session freshness: {e}')
            return False

        if seconds_since_last_login is None:
            return False

        return seconds_since_last_login < settings.SESSION_MAX_AGE_SECONDS

    def get_last_ory_login_delta(self, request, aal):
        logins = request.META['session']['authentication_methods']
        login = next((login for login in logins if login['aal'] == aal), None)

        if login:
            completed_at = datetime.strptime(
                login['completed_at'],
                '%Y-%m-%dT%H:%M:%S.%fZ'
            )
            return int(time.time()) - int(completed_at.timestamp())
        else:
            return None

    def get_last_aal15_login_delta(self, request):
        pass


class HighestAalFreshSession(BaseFreshSessionClass):

    def has_permission(self, request):
        return self.check_session_is_fresh(request, request.user.highest_aal)


class Aal1FreshSession(BaseFreshSessionClass):

    def has_permission(self, request):
        return self.check_session_is_fresh(request, 'aal1')
