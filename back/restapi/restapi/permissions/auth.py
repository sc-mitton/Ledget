import time
from datetime import datetime
import logging
import functools

from rest_framework.status import HTTP_401_UNAUTHORIZED
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import AnonymousUser
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.conf import settings
import stripe


stripe.api_key = settings.STRIPE_API_KEY
stripe_logger = logging.getLogger("stripe")
logger = logging.getLogger("ledget")

AAL_FRESHNESS_ERROR_MESSAGE = "Required session aal or freshness is not met"
OATHKEEPER_HEADER = settings.OATHKEEPER_AUTH_HEADER.upper()


class IsAuthenticated(BasePermission):

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser) or not request.user.is_authenticated:
            return False

        device_aal = getattr(request.device, "aal", None)

        # in reality the device_aal should be at least as high as the session aal
        session_aal = request.ory_session.aal if request.ory_session else None

        if request.user.settings.mfa_method == "totp":
            if device_aal == "aal2" or session_aal == "aal2":
                return True
            else:
                raise ValidationError(
                    {
                        "message": "Device must have aal2 level session via totp",
                        "code": "AAL2_TOTP_REQUIRED",
                    }
                )
        else:
            return session_aal == "aal1" or session_aal == "aal2"


class CanExtendSession(BasePermission):
    '''
    Check if the user is authenticated with a mobile session
    '''

    def has_permission(self, request, view):
        return self.is_mobile_session(request) or self.is_oidc_session(request)

    def is_mobile_session(self, request):
        return request.device and request.device.is_mobile

    def is_oidc_session(self, request):
        if not request.ory_session:
            return False

        try:
            is_oidc_session = any([a['method'] == 'oidc'
                                   for a in request.ory_session.auth_methods])
            return is_oidc_session
        except Exception as e:
            logger.error(f"Error checking OIDC signin: {e}")
            return False


class IsAuthedVerifiedSubscriber(IsAuthenticated):
    """Class for bundling permissions for User views"""

    def has_permission(self, request, view):
        checks = [
            request.user.account.service_provisioned_until > int(time.time()),
            request.user.account.customer.subscription_not_canceled,
            request.user.is_active,
        ]

        return super().has_permission(request, view) and all(checks)


class BaseFreshSessionClass(BasePermission):
    message = AAL_FRESHNESS_ERROR_MESSAGE

    def check_session_is_fresh(self, request, aal):
        try:
            seconds_since_last_login = self.get_last_ory_login_delta(request, aal)
        except Exception as e:
            logger.error(f"Error checking session freshness: {e}")
            return False

        return seconds_since_last_login < settings.SESSION_MAX_AGE_SECONDS

    def get_last_ory_login_delta(self, request, aal):
        '''
        Check the session information for the last login with the given aal
        and return the time since that login in seconds
        '''

        logins = request.META[OATHKEEPER_HEADER]["session"]["authentication_methods"]
        last_login = None
        for login in reversed(logins):
            if login["aal"] == aal:
                last_login = login
                break

        if last_login:
            completed_at = datetime.fromisoformat(last_login["completed_at"])
            return int(time.time()) - int(completed_at.timestamp())
        else:
            return settings.SESSION_MAX_AGE_SECONDS + 1000


class HighestAalFreshSession(BaseFreshSessionClass):

    def has_permission(self, request, view):
        return self.check_session_is_fresh(request, request.user.highest_aal)


class Aal1FreshSession(BaseFreshSessionClass):

    def has_permission(self, request, view):
        return self.check_session_is_fresh(request, "aal1")


def highest_aal_freshness(func):

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        request = args[1]
        if not HighestAalFreshSession().check_session_is_fresh(
            request, request.user.highest_aal
        ):
            return Response(
                {"error": AAL_FRESHNESS_ERROR_MESSAGE}, status=HTTP_401_UNAUTHORIZED
            )
        else:
            return func(*args, **kwargs)

    return wrapper


def _has_no_active_subscription(customer_id):
    """
    Check if the customer has an active subscription, or
    if they have a subscription that will be canceled at
    the end of the billing period
    """

    for sub in stripe.Subscription.list(customer=customer_id).data:
        if not sub.cancel_at_period_end:
            return False

    return True


def can_create_stripe_subscription(func):

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        request = args[1]
        if request.user.account.has_customer and not _has_no_active_subscription(
            request.user.account.customer.id
        ):
            return Response(
                {"error": "You already have an active subscription"},
                status=HTTP_401_UNAUTHORIZED,
            )
        else:
            return func(*args, **kwargs)

    return wrapper
