import hashlib
import logging

from django.conf import settings
from django.utils.regex_helper import _lazy_re_compile
from django.utils.crypto import constant_time_compare
from django.middleware.csrf import (
    InvalidTokenFormat,
    CsrfViewMiddleware,
    RejectRequest
)

ORY_SESSION_TOKEN_HEADER = settings.ORY_SESSION_TOKEN_HEADER

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
    auth_token = request.META.get(settings.OATHKEEPER_JWT_HEADER)
    if not settings.SECRET_KEY:
        raise RejectRequest(REASON_MISSING_SECRET_KEY)
    elif not auth_token:
        raise RejectRequest(REASON_CSRF_TOKEN_MISSING)

    try:
        session_id = auth_token['session']['id']
    except KeyError:  # pragma: no cover
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
            else:  # pragma: no cover
                return None
        except InvalidTokenFormat:  # pragma: no cover
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
        except BadDigest:
            raise RejectRequest(REASON_MISSING_HMAC_DIGEST)
        else:
            if csrf_secret:
                request.META["CSRF_COOKIE"] = csrf_secret

    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Tokens are used for mobile clients, and csrf is not needed
        if request.META.get(ORY_SESSION_TOKEN_HEADER, False):
            setattr(callback, 'csrf_exempt', True)
        elif not getattr(callback, 'csrf_ignore', False):
            setattr(callback, 'csrf_exempt', False)

        return super().process_view(
            request, callback, callback_args, callback_kwargs)
