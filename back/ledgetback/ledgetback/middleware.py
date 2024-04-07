import hashlib
import logging

from jwt.exceptions import (
    InvalidSignatureError,
    ExpiredSignatureError,
    InvalidAlgorithmError
)
from jwt import decode
from django.conf import settings
from django.utils.regex_helper import _lazy_re_compile
from django.utils.deprecation import MiddlewareMixin
from django.utils.crypto import constant_time_compare
from django.middleware.csrf import (
    InvalidTokenFormat,
    CsrfViewMiddleware,
    RejectRequest

)

OATHKEEPER_PUBLIC_KEY = settings.OATHKEEPER_PUBLIC_KEY
OATHKEEPER_SCHEME = settings.OATHKEEPER_AUTH_SCHEME.lower()
OATHKEEPER_HEADER = settings.OATHKEEPER_AUTH_HEADER.upper()

logger = logging.getLogger('ledget')

REASON_CSRF_TOKEN_MISSING = "CSRF token missing."
REASON_MISSING_HMAC_DIGEST = "HMAC digest missing."
REASON_MISSING_SECRET_KEY = "The SECRET_KEY setting must not be empty."
REASON_INVALID_CHARACTERS = "CSRF token contains invalid characters."

invalid_token_chars_re = _lazy_re_compile("[^a-zA-Z0-9]")


class NeedsNewCsrfToken(Exception):
    '''Request should have a csrf token but does not.'''
    pass


class BadDigest(Exception):
    def __init__(self):
        self.reason = REASON_MISSING_HMAC_DIGEST


def _check_token_format(token):
    if invalid_token_chars_re.search(token):
        raise InvalidTokenFormat(REASON_INVALID_CHARACTERS)


def _get_hmac(request):
    auth_token = request.META.get(settings.OATHKEEPER_AUTH_HEADER)
    if not auth_token or not settings.SECRET_KEY:
        raise BadDigest

    try:
        session_id = auth_token['session']['id']
    except KeyError:
        raise BadDigest

    unhashed = ''.join([settings.SECRET_KEY, session_id])
    hmac = hashlib.sha256(unhashed.encode('utf-8')).hexdigest()
    return hmac


def add_new_csrf_hmac_cookie(request):
    csrf_secret = _get_hmac(request)
    request.META.update({
        'CSRF_COOKIE': csrf_secret,
        'CSRF_COOKIE_NEEDS_UPDATE': True
    })
    return csrf_secret


class CustomCsrfMiddleware(CsrfViewMiddleware):

    def _get_secret(self, request) -> str | None:
        try:
            csrf_secret = request.COOKIES[settings.CSRF_COOKIE_NAME]
            _check_token_format(csrf_secret)
        except KeyError:
            if request.META.get('OATHKEEPER_JWT_IS_DECODED', False):
                raise NeedsNewCsrfToken
            else:
                return None
        except InvalidTokenFormat:
            raise NeedsNewCsrfToken

        return csrf_secret

    def _check_token(self, request):

        # Get the two relevant pieces of information, the
        # the returned csrftoken in the custom header and the hmac
        try:
            hmac = _get_hmac(request)
        except BadDigest as e:
            raise RejectRequest(e.reason)

        try:
            request_csrf_token = request.META[settings.CSRF_HEADER_NAME]
            token_source = settings.CSRF_HEADER_NAME
        except KeyError:
            raise RejectRequest(REASON_CSRF_TOKEN_MISSING)

        try:
            _check_token_format(request_csrf_token)
        except InvalidTokenFormat as e:
            reason = self._bad_token_message(e.reason, token_source)
            raise RejectRequest(reason)

        if not constant_time_compare(request_csrf_token, hmac):
            reason = self._bad_token_message("incorrect", token_source)
            raise RejectRequest(reason)

    def process_request(self, request):

        try:
            csrf_secret = self._get_secret(request)
        except NeedsNewCsrfToken:
            add_new_csrf_hmac_cookie(request)
        else:
            if csrf_secret:
                request.META["CSRF_COOKIE"] = csrf_secret

    def process_view(self, request, callback, callback_args, callback_kwargs):
        if not getattr(callback, 'csrf_ignore', False):
            setattr(callback, 'csrf_exempt', False)

        return super().process_view(request, callback, callback_args, callback_kwargs)


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
