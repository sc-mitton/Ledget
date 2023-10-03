
from functools import wraps
from django.utils.decorators import decorator_from_middleware
from ledgetback.middleware import CustomCsrfMiddleware, add_new_csrf_hmac_cookie


def csrf_ignore(view_func):
    """Mark a view function as being exempt from the CSRF view protection."""

    # view_func.csrf_exempt = True would also work, but decorators are nicer
    # if they don't have side effects, so return a new function.
    @wraps(view_func)
    def wrapper_view(*args, **kwargs):
        return view_func(*args, **kwargs)

    wrapper_view.csrf_ignore = True
    return wrapper_view


class _EnsureCsrfCookie(CustomCsrfMiddleware):
    def _reject(self, request, reason):
        return None

    def process_view(self, request, callback, callback_args, callback_kwargs):
        retval = super().process_view(request, callback, callback_args, callback_kwargs)
        # Force process_response to send the cookie
        add_new_csrf_hmac_cookie(request)
        return retval


ensure_csrf_cookie = decorator_from_middleware(_EnsureCsrfCookie)
