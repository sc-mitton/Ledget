import hashlib
import logging
from urllib.parse import urlparse

from django.conf import settings
from django.utils.cache import patch_vary_headers
from django.utils.regex_helper import _lazy_re_compile
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import DisallowedHost
from django.utils.http import is_same_domain
from django.http import HttpHeaders
from django.utils.crypto import constant_time_compare

logger = logging.getLogger('ledget')

invalid_token_chars_re = _lazy_re_compile("[^a-zA-Z0-9]")
REASON_BAD_ORIGIN = "Origin checking failed - %s does not match any trusted origins."
REASON_NO_REFERER = "Referer checking failed - no Referer."
REASON_BAD_REFERER = "Referer checking failed - %s does not match any trusted origins."
REASON_MALFORMED_REFERER = "Referer checking failed - Referer is malformed."
REASON_INSECURE_REFERER = (
    "Referer checking failed - Referer is insecure while host is secure."
)
REASON_CSRF_TOKEN_MISSING = "CSRF token missing."
REASON_INVALID_CSRFTOKEN = "CSRF token missing or incorrect."
REASON_ANONYMOUS_USER = "User is anonymous."
REASON_MISSING_SECRET_KEY = "The SECRET_KEY setting must not be empty."


class InvalidTokenFormat(Exception):
    def __init__(self, reason):
        self.reason = "has invalid characters"


class RejectRequest(Exception):
    def __init__(self, reason):
        self.reason = reason


class BadDigest(Exception):
    def __init__(self, reason):
        self.reason = reason


def _check_token_format(token):
    """
    Raise an InvalidTokenFormat error if the token has
    characters that aren't allowed.
    """
    if invalid_token_chars_re.search(token):
        raise InvalidTokenFormat


def _get_hmac(request):
    if request.user.is_anonymous:
        raise BadDigest(REASON_ANONYMOUS_USER)
    if settings.SECRET_KEY is None:
        raise BadDigest(REASON_MISSING_SECRET_KEY)

    unhashed = ''.join[settings.SECRET_KEY, request.user.session_id]
    hmac = hashlib.sha256(unhashed.encode('utf-8')).hexdigest()
    return hmac


def _add_new_csrf_cookie(request):
    csrf_secret = _get_hmac()
    request.META.update({'CSRF_COOKIE': csrf_secret, 'CSRF_COOKIE_NEEDS_UPDATE': True})
    return csrf_secret


def _does_match(item1, item2):
    return constant_time_compare(item1, item2)


class CustomCsrfMiddleware:

    # For requires_csfr decorator
    def _accept(self, request):
        # Avoid checking the request twice by adding a custom attribute to
        # request. This will be relevant when both decorator and middleware
        # are used.
        request.csrf_processing_done = True
        return None

    def _reject(self, request, reason):
        logger.warning("Forbidden (%s): %s", reason, request.path)
        return Response(
            {'detail': 'Forbidden', 'reason': reason},
            status.HTTP_403_FORBIDDEN
        )

    def _get_secret(self, request):
        '''Get original secret with request or None'''

        try:
            csrf_secret = request.COOKIES[settings.CSRF_COOKIE_NAME]
        except KeyError:
            csrf_secret = None
        else:
            # This can raise InvalidTokenFormat.
            _check_token_format(csrf_secret)

        if csrf_secret is None:
            return None

        return csrf_secret

    def _bad_token_message(self, reason, token_source):
        if token_source != "POST":
            # Assume it is a settings.CSRF_HEADER_NAME value.
            header_name = HttpHeaders.parse_header_name(token_source)
            token_source = f"the {header_name!r} HTTP header"
        return f"CSRF token from {token_source} {reason}."

    def _check_referer(self, request):
        referer = request.META.get("HTTP_REFERER")
        if referer is None:
            raise RejectRequest(REASON_NO_REFERER)

        try:
            referer = urlparse(referer)
        except ValueError:
            raise RejectRequest(REASON_MALFORMED_REFERER)

        # Make sure we have a valid URL for Referer.
        if "" in (referer.scheme, referer.netloc):
            raise RejectRequest(REASON_MALFORMED_REFERER)

        # Ensure that our Referer is also secure.
        if referer.scheme != "https":
            raise RejectRequest(REASON_INSECURE_REFERER)

        if any(
            is_same_domain(referer.netloc, host)
            for host in self.csrf_trusted_origins_hosts
        ):
            return
        # Allow matching the configured cookie domain.
        good_referer = (
            settings.SESSION_COOKIE_DOMAIN
            if settings.CSRF_USE_SESSIONS
            else settings.CSRF_COOKIE_DOMAIN
        )
        if good_referer is None:
            # If no cookie domain is configured, allow matching the current
            # host:port exactly if it's permitted by ALLOWED_HOSTS.
            try:
                # request.get_host() includes the port.
                good_referer = request.get_host()
            except DisallowedHost:
                raise RejectRequest(REASON_BAD_REFERER % referer.geturl())
        else:
            server_port = request.get_port()
            if server_port not in ("443", "80"):
                good_referer = "%s:%s" % (good_referer, server_port)

        if not is_same_domain(referer.netloc, good_referer):
            raise RejectRequest(REASON_BAD_REFERER % referer.geturl())

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

        if not _does_match(request_csrf_token, hmac):
            reason = self._bad_token_message("incorrect", token_source)
            raise RejectRequest(reason)

    def process_request(self, request):
        try:
            csrf_secret = self._get_secret(request)
        except InvalidTokenFormat:
            _add_new_csrf_cookie(request)
        else:
            if csrf_secret is not None:
                request.META["CSRF_COOKIE"] = csrf_secret

    def process_view(self, request, callback, callback_args, callback_kwargs):
        if getattr(request, "csrf_processing_done", False):
            return None

        # Wait until request.META["CSRF_COOKIE"] has been manipulated before
        # bailing out, so that get_token still works
        if getattr(callback, 'csrf_exempt', False):
            return None

        # Assume that anything not defined as 'safe' by RFC 9110 needs protection
        if request.method in ("GET", "HEAD", "OPTIONS", "TRACE"):
            return self._accept(request)

        if getattr(request, "_dont_enforce_csrf_checks", False):
            # Mechanism to turn off CSRF checks for test suite. It comes after
            # the creation of CSRF cookies, so that everything else continues
            # to work exactly the same (e.g. cookies are sent, etc.), but
            # before any branches that call the _reject method.
            return self._accept(request)

        # Reject the request if the Origin header doesn't match an allowed
        # value.
        if "HTTP_ORIGIN" in request.META:
            if not self._origin_verified(request):
                return self._reject(
                    request, REASON_BAD_ORIGIN % request.META["HTTP_ORIGIN"]
                )
        elif request.is_secure():
            # If the Origin header wasn't provided, reject HTTPS requests if
            # the Referer header doesn't match an allowed value.
            #
            # Suppose user visits http://example.com/
            # An active network attacker (man-in-the-middle, MITM) sends a
            # POST form that targets https://example.com/detonate-bomb/ and
            # submits it via JavaScript.
            #
            # The attacker will need to provide a CSRF cookie and token, but
            # that's no problem for a MITM and the session-independent secret
            # we're using. So the MITM can circumvent the CSRF protection. This
            # is true for any HTTP connection, but anyone using HTTPS expects
            # better! For this reason, for https://example.com/ we need
            # additional protection that treats http://example.com/ as
            # completely untrusted. Under HTTPS, Barth et al. found that the
            # Referer header is missing for same-domain requests in only about
            # 0.2% of cases or less, so we can use strict Referer checking.
            try:
                self._check_referer(request)
            except RejectRequest as e:
                return self._reject(request, e.reason)

        try:
            self._check_token(request)
        except RejectRequest as e:
            return self._reject(request, e.reason)

        return self._accept(request)

    def process_response(self, request, response):

        if request.META['CSRF_COOKIE_NEEDS_UPDATE']:

            response.set_cookie(
                settings.CSRF_COOKIE_NAME,
                request.META["CSRF_COOKIE"],
                max_age=settings.CSRF_COOKIE_AGE,
                domain=settings.CSRF_COOKIE_DOMAIN,
                secure=settings.CSRF_COOKIE_SECURE,
                httponly=settings.CSRF_COOKIE_HTTPONLY,
                samesite=settings.CSRF_SAMESITE,
            )

            # Set the Vary header since content varies with the CSRF cookie.
            patch_vary_headers(response, ("Cookie",))

            request.META['CSRF_COOKIE_NEEDS_UPDATE'] = False

        return response
