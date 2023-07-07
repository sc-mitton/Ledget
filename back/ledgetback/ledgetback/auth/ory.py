from rest_framework.authentication import BaseAuthentication
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt.exceptions import InvalidSignatureError, ExpiredSignatureError
from jwt import decode

import logging

logger = logging.getLogger('ledget')


class OryBackend(BaseAuthentication):

    def authenticate(self, request):
        """
        Validate the JWT token against the Oathkeeper public key and
        set the user in the request. If the token is absent, invalid,
        or expired, return None.
        """

        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split(' ')
        if auth_header[0].lower() != 'bearer':
            return None
        else:
            token = auth_header[-1]

        try:
            decoded_jwt = self.get_decoded_jwt(token)
        except InvalidSignatureError:
            logger.error(f"Invalid signature for token: {token}")
            return None
        except ExpiredSignatureError:
            logger.error(f"Expired signature for token: {token}")
            return None
        else:
            user = self.get_user(decoded_jwt)
            return (user, None) if user else None

    def get_decoded_jwt(self, token: str) -> dict | None:
        """Validate the token against the JWK from Oathkeeper and
        return it if valid. Otherwise, return None."""

        public_key = settings.OATHKEEPER_PUBLIC_KEY
        decoded_token = decode(
            token,
            key=public_key,
            algorithms=['RS256'],
            options={'verify_exp': True}
        )

        return decoded_token

    def get_user(self, decoded_token: dict) -> get_user_model() | None:
        """Return the user from the decoded token."""

        try:
            identity = decoded_token['session']['identity']
            user = get_user_model().objects.get(pk=identity['id'])
            user.traits = identity.get('traits')
            return user
        except get_user_model().DoesNotExist:
            logger.error(f"User does not exist: {identity['id']}")
            return None
        except KeyError:
            return None
