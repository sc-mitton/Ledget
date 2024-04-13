import logging

from jwt.exceptions import (
    InvalidSignatureError,
    ExpiredSignatureError,
    InvalidAlgorithmError
)
from jwt import decode

from django.utils.deprecation import MiddlewareMixin
from django.conf import settings

logger = logging.getLogger('ledget')

OATHKEEPER_PUBLIC_KEY = settings.OATHKEEPER_PUBLIC_KEY
OATHKEEPER_SCHEME = settings.OATHKEEPER_AUTH_SCHEME.lower()
OATHKEEPER_HEADER = settings.OATHKEEPER_AUTH_HEADER.upper()


class OryAuthenticationMiddleware(MiddlewareMixin):
    '''Middleware in charge of decoding the JWT token from Oathkeeper
    that contains the session and identity information, and setting
    the information in place of the original authorization header.
    '''

    def process_request(self, request):
        '''
        Validate the JWT token against the Oathkeeper public key and
        set the user in the request. If the token is absent, invalid,
        or expired, return None.
        '''

        header = request.META.get(OATHKEEPER_HEADER, '').split(' ')
        auth_header_schemes = [header[i].lower() for i in range(0, len(header), 2)]

        if OATHKEEPER_SCHEME not in auth_header_schemes:
            return

        try:
            token = header[auth_header_schemes.index(OATHKEEPER_SCHEME)*2 + 1]
            decoded_jwt = self.get_decoded_jwt(token)
        except (InvalidSignatureError, ExpiredSignatureError,
                InvalidAlgorithmError, Exception) as e:
            logger.error(f"{e.__class__.__name__} {e}")
        else:
            request.META[OATHKEEPER_HEADER] = decoded_jwt
            request.META['OATHKEEPER_JWT_IS_DECODED'] = True

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
