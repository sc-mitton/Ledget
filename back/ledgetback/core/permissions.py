from rest_framework.permissions import BasePermission


class IsUserOwner(BasePermission):

    def has_permission(self, request, view):
        path = request.path.split('/')
        user_id = path[path.index('user') + 1]
        return request.user.id == user_id
