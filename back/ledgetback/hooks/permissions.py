from secrets import compare_digest

from rest_framework.permissions import BasePermission
from django.conf import settings

ory_api_key = settings.ORY_API_KEY


class CameFromOry(BasePermission):

    def has_permission(self, request, view):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split(' ')
        auth_scheme = auth_header[0].lower()
        key = auth_header[-1]

        if auth_scheme.lower() == 'api-key' \
           and compare_digest(key, ory_api_key):
            return True
        else:
            return False
