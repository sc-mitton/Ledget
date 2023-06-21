from functools import wraps
from secrets import compare_digest

from django.http import HttpResponseForbidden
from django.conf import settings

ory_api_key = settings.ORY_API_KEY


def ory_api_key_auth(func):

    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        given_api_key = request.META.get('Authorization')

        if not compare_digest(given_api_key, f'Api-Key {ory_api_key}'):
            return HttpResponseForbidden(
                'Incorrect token',
                content_type='text/plain'
            )

        return func(self, request, *args, **kwargs)

    return wrapper
