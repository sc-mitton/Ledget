from rest_framework import permissions


class HasCustomer(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.account.has_customer:
            return False
        return True
