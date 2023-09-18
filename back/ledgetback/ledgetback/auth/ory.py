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

from .errors import InvalidAuthHeaderError, MissingDeviceTokenError


logger = logging.getLogger('ledget')
OATHKEEPER_PUBLIC_KEY = settings.OATHKEEPER_PUBLIC_KEY


class OryBackend(BaseAuthentication):

    def authenticate(self, request):
        """
        Validate the JWT token against the Oathkeeper public key and
        set the user in the request. If the token is absent, invalid,
        or expired, return None.
        """

        try:
            token = self.get_encoded_token(request)
            decoded_jwt = self.get_decoded_jwt(token)
            user = self.get_user(decoded_jwt)
        except (InvalidSignatureError, ExpiredSignatureError,
                InvalidAlgorithmError, Exception) as e:
            logger.error(f"{e.__class__.__name__} {e}")
            return None

        # try:
        #     self.check_device_token(request, user)
        # except MissingDeviceTokenError as e:
        #     logger.error(f"{e.__class__.__name__} {e}")
        #     return None

        return (user, None)

    def check_device_token(self, request, user):

        # Check the ledget_device_token cookie
        device_token = request.COOKIES.get('ledget_device_token')
        if user.device_set.filter(token=device_token).exists():
            return
        else:
            raise MissingDeviceTokenError()

    def get_encoded_token(self, request) -> str:

        header = request.META.get('HTTP_AUTHORIZATION', '').split(' ')
        auth_header_keys = [header[i].lower()
                            for i in range(0, len(header), 2)]

        if 'bearer' not in auth_header_keys:
            raise InvalidAuthHeaderError(
                "Authorization header is missing or invalid."
            )

        return header[auth_header_keys.index('bearer')*2 + 1]

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

    def get_user(self, decoded_token: dict):
        """Return the user from the decoded token."""

        identity = decoded_token['session']['identity']

        user = get_user_model().objects.select_related('customer') \
                                       .prefetch_related('device_set') \
                                       .get(pk=identity['id'])

        user.authentication_level = \
            decoded_token['session']['authenticator_assurance_level']
        user.traits = identity.get('traits', {})
        user.session_devices = identity.get('devices', [])
        user.is_verified = identity.get('verifiable_addresses', [{}])[0] \
                                   .get('verified', False)

        return user
