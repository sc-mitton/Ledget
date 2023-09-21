import time
import logging

from rest_framework.permissions import BasePermission
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
import stripe


stripe.api_key = settings.STRIPE_API_KEY
stripe_logger = logging.getLogger('stripe')


class IsAuthenticated(BasePermission):

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser) \
                or not request.user.is_authenticated:
            return False

        device_aal = getattr(request.user.device, 'aal', None)
        session_aal = getattr(request.user, 'session_aal', None)

        if request.user.mfa_method:
            return device_aal == 'aal2' or session_aal == 'aal2'
        else:
            return device_aal == 'aal1'


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


class CanCreateStripeSubscription(BaseException):

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
