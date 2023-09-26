import logging

from rest_framework.authentication import BaseAuthentication
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt.exceptions import (
    InvalidSignatureError,
    ExpiredSignatureError,
    InvalidAlgorithmError
)
from jwt import decode


logger = logging.getLogger('ledget')
OATHKEEPER_PUBLIC_KEY = settings.OATHKEEPER_PUBLIC_KEY


class OryBackend(BaseAuthentication):

    def authenticate(self, request):
        """
        Validate the JWT token against the Oathkeeper public key and
        set the user in the request. If the token is absent, invalid,
        or expired, return None.
        """
        header = request.META.get('HTTP_AUTHORIZATION', '').split(' ')
        auth_header_keys = [header[i].lower()
                            for i in range(0, len(header), 2)]

        if 'bearer' not in auth_header_keys:
            return None

        try:
            token = header[auth_header_keys.index('bearer')*2 + 1]
            decoded_jwt = self.get_decoded_jwt(token)
            user = self.get_user(request, decoded_jwt)
        except (InvalidSignatureError, ExpiredSignatureError,
                InvalidAlgorithmError, Exception) as e:
            logger.error(f"{e.__class__.__name__} {e}")
            return None

        return (user, None)

    def get_decoded_jwt(self, token: str) -> dict | None:
        """Validate the token against the JWK from Oathkeeper and
        return it if valid. Otherwise, return None."""

        decoded_token = decode(
            token,
            key=OATHKEEPER_PUBLIC_KEY,
            algorithms=['RS256'],
            options={'verify_exp': True}
        )

        return decoded_token

    def get_user(self, request, decoded_token: dict):
        """Return the user from the decoded token."""
        device_token = request.COOKIES.get('ledget_device')
        identity = decoded_token['session']['identity']

        User = get_user_model()
        user = User.objects \
                   .prefetch_related('device__set') \
                   .select_related('customer') \
                   .get(pk=identity['id']) \

        for device in user.device_set.all():
            if device.token == device_token:
                user.device = device

        user.session_aal = \
            decoded_token['session']['authenticator_assurance_level']
        user.traits = identity.get('traits', {})
        user.is_verified = identity.get('verifiable_addresses', [{}])[0] \
                                   .get('verified', False)

        if request.path.endswith('devices'):
            user.session_devices = decoded_token['session']['devices']

        return user
