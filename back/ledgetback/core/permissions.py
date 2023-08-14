from rest_framework.permissions import BasePermission


class IsUserOwner(BasePermission):

    def has_permission(self, request, view):
        return self.has_object_permission(request)

    def has_object_permission(self, request):
        path = request.path.split('/')
        user_id = path[path.index('user') + 1]
        return str(request.user.id) == user_id


class IsVerifiedAuthenticated(BasePermission):

    def has_permission(self, request, view):
        return bool(request.user
                    and request.user.is_authenticated
                    and request.user.is_verified)


class UserPermissionBundle(IsUserOwner):
    """Class for bundling permissions for User views"""

    def has_permission(self, request, view):

        checks = [
            self.has_object_permission(request),
            request.user.customer.has_current_subscription,
            request.user.is_authenticated,
            request.user.is_verified,
        ]

        return all(checks)
