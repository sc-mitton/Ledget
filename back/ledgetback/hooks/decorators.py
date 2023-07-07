from functools import wraps
from secrets import compare_digest

from django.http import HttpResponseForbidden
from django.conf import settings

ory_api_key = settings.ORY_API_KEY


def ory_api_key_auth(func):

    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split(' ')
        auth_scheme = auth_header[0].lower()
        key = auth_header[-1]

        if auth_scheme.lower() == 'api-key' \
           and compare_digest(key, ory_api_key):
            return func(self, request, *args, **kwargs)
        else:
            return HttpResponseForbidden(
                'Incorrect token',
                content_type='text/plain'
            )

    return wrapper
