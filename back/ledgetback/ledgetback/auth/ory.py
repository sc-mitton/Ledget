from rest_framework.authentication import BaseAuthentication
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt.exceptions import InvalidSignatureError
from jwt import decode

import logging
import time

logger = logging.getLogger('ledget')


class OryBackend(BaseAuthentication):

    def authenticate(self, request):
        """
        Validate the JWT token against the Oathkeeper public key and
        set the user in the request. If the token is absent, invalid,
        or expired, return None.
        """

        token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[-1]
        decoded_token = self.get_decoded_token(token) if token else None

        if not decoded_token or self.token_is_expired(decoded_token):
            return None

        try:
            identity = decoded_token['session']['identity']
            user = get_user_model().objects.get(identity['id'])
            user.traits = identity.get('traits')
            return (user, None)
        except get_user_model().DoesNotExist:
            logger.error(f"User does not exist: {identity['id']}")
            return None
        except KeyError:
            return None

    def token_is_expired(self, token: str) -> bool:

        curent_unix_timestamp = int(time.time())
        is_expired = token.get('exp', 0) < curent_unix_timestamp

        return is_expired

    def get_decoded_token(self, token: str) -> dict | None:
        """Validate the token against the JWK from Oathkeeper and
        return it if valid. Otherwise, return None."""

        public_key = settings.OATHKEEPER_PUBLIC_KEY
        try:
            decoded_token = decode(
                token,
                key=public_key,
                algorithms=['RS256'],
            )
        except InvalidSignatureError:
            logger.error(f"InvalidSignatureError: {token}")
            return None

        return decoded_token
