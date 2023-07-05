from django.conf import settings
from django.contrib.auth import get_user_model
from jwt.exceptions import InvalidSignatureError
from jwt import decode
from django.contrib.auth.models import AnonymousUser

import logging
import time

logger = logging.getLogger('ledget')


class OathkeeperMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[-1]
        decoded_token = self.get_decoded_token(token) if token else None

        if decoded_token and not self.token_is_expired(decoded_token):
            user_id = decoded_token.get('session', {}) \
                                   .get('identity', {}) \
                                   .get('id', '')
            request.user = self.get_user(user_id) or AnonymousUser
        else:
            request.user = AnonymousUser

        response = self.get_response(request)
        return response

    def token_is_expired(self, token: str) -> bool:
        curent_unix_timestamp = int(time.time())
        return token.get('exp', 0) < curent_unix_timestamp

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

    def get_user(self, user_id: str):
        try:
            return get_user_model().objects.get(pk=user_id)
        except get_user_model().DoesNotExist:
            return None
