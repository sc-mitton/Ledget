from rest_framework.permissions import BasePermission
from django.contrib.auth.models import AnonymousUser


class IsVerifiedAuthenticated(BasePermission):

    def has_permission(self, request, view):
        return bool(request.user
                    and request.user.is_authenticated
                    and request.user.is_verified)


class IsAuthedVerifiedSubscriber(BasePermission):
    """Class for bundling permissions for User views"""

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser):
            return False
        checks = [
            request.user.is_authenticated,
            request.user.is_verified,
            request.user.subscription_status is not None,
        ]

        return all(checks)


class IsObjectOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        try:
            return request.user.id == obj.id or request.user.id == obj.user_id
        except AttributeError:
            return False
