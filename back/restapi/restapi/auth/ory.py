import logging

from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user_model
from django.conf import settings

logger = logging.getLogger('ledget')

OATHKEEPER_AUTH_HEADER = settings.OATHKEEPER_AUTH_HEADER


class OryBackend(SessionAuthentication):

    def authenticate(self, request):
        """
        Validate the JWT token against the Oathkeeper public key and
        set the user in the request. If the token is absent, invalid,
        or expired, return None.
        """

        # header should already be decoded by middleware

        decoded_jwt = request.META.get(OATHKEEPER_AUTH_HEADER)
        if not decoded_jwt:
            return

        try:
            user = self.get_user(request, decoded_jwt)
            request.device = self._get_device(user, request)
        except Exception as e:
            logger.error(f"{e.__class__.__name__} {e}")
            return None

        return (user, None)

    def _get_device(self, user, request):
        """Check if the device token is valid for a given user"""

        device_token_cookies = {k: v for k, v in request.COOKIES.items()
                                if 'ledget_device' in k}

        for device in user.device_set.all():
            if device.token in device_token_cookies.values():
                return device

    def get_user(self, request, decoded_token: dict):
        """Return the user from the decoded token."""

        identity = decoded_token['session']['identity']

        User = get_user_model()
        user = User.objects \
                   .prefetch_related('device__set') \
                   .select_related('customer') \
                   .get(pk=identity['id'])
        user.traits = identity.get('traits', {})

        return user
