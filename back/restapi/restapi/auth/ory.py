import logging

from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user_model
from django.conf import settings
from secrets import compare_digest


logger = logging.getLogger('ledget')

OATHKEEPER_JWT_HEADER = settings.OATHKEEPER_JWT_HEADER
DEVICE_TOKEN_HEADER = settings.DEVICE_TOKEN_HEADER


class OryBackend(SessionAuthentication):

    def authenticate(self, request):
        """
        Validate the JWT token against the Oathkeeper public key and
        set the user in the request. If the token is absent, invalid,
        or expired, return None.
        """

        # header should already be decoded by middleware

        decoded_jwt = request.META.get(OATHKEEPER_JWT_HEADER)
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

        device_tokens = self._get_tokens(request)

        for device in user.device_set.all():
            if any(compare_digest(device.token.encode(), token.encode())
                   for token in device_tokens):
                return device

    def _get_tokens(self, request):

        result = []

        for k, v in request.COOKIES.items():
            if 'ledget_device' in k:
                result.append(v)

        if DEVICE_TOKEN_HEADER in request.META:
            result.append(request.META[DEVICE_TOKEN_HEADER])

        return result

    def get_user(self, request, decoded_token: dict):
        """Return the user from the decoded token."""

        identity = decoded_token['session']['identity']

        User = get_user_model()
        user = (
            User.objects.prefetch_related('device_set')
            .select_related('settings')
            .select_related('account__customer')
            .prefetch_related('account__users').all()
            .get(pk=identity['id'])
        )
        user.traits = identity.get('traits', {})

        return user
