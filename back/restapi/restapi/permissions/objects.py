import functools
import logging

from rest_framework.permissions import BasePermission

import stripe
from django.conf import settings
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED


stripe.api_key = settings.STRIPE_API_KEY
stripe_logger = logging.getLogger("stripe")
logger = logging.getLogger("ledget")


"""
Access Levels
-------------

Shared:
All users on the account are able to read and edit the object in any way.

Private:
All users have read access, but only the primary user has edit access

Hidden:
The object is hidden and un-editable to the account co owner. Data will
still be returned, but it will be masked for purposes of the UI.

Null (or no privacy attribute):
If an object does not have a privacy attribute, it is assumed to be a shared
object, and either the user or the co-owner can access it.
"""


class IsObjectOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        try:
            if hasattr(obj, 'users'):
                return request.user.id in obj.users.all().values_list('id', flat=True)
            else:
                return request.user.id == obj.id or request.user.id == obj.user_id
        except AttributeError:
            return False


class HasObjectAccess(BasePermission):
    """
    Used in the permission class list for a view. The permission class will
    cause strictly denying or allowingn access to objects.
    """

    def has_object_permission(self, request, view, obj):
        try:
            return (
                self.has_read_access(request, obj)
                if request.method == "GET"
                else self.has_write_access(request, obj)
            )
        except AttributeError as e:  # pragma: no cover
            logger.error(f"Error checking object access: {e}")
            return False

    def has_read_access(self, request, obj):

        if request.user.co_owner:
            return self.user_has_obj_access(obj, request.user.id) or \
                     self.user_has_obj_access(obj, request.user.co_owner.id)
        else:
            return self.user_has_obj_access(obj, request.user.id)

    def has_write_access(self, request, obj):
        obj_is_shared = hasattr(obj, "privacy") and obj.privacy == "shared"

        if not hasattr(obj, "privacy") or obj_is_shared:
            if request.user.co_owner:
                return self.user_has_obj_access(obj, request.user.id) or \
                         self.user_has_obj_access(obj, request.user.co_owner.id)
            else:
                return self.user_has_obj_access(obj, request.user.id)
        else:
            return self.user_has_obj_access(obj, request.user.id)

    def user_has_obj_access(self, obj, user_id):
        if hasattr(obj, "users"):
            return (user_id in obj.users.all().values_list("id", flat=True))
        else:
            return (user_id == obj.id or user_id == obj.user_id)


class HasObjectAccessLooseWrite(HasObjectAccess):

    def has_write_access(self, request, obj):
        '''
        Override write access method to allow users with shared access to edit
        '''
        permission = False

        obj_is_not_hidden = hasattr(obj, "privacy") and obj.privacy != "hidden"
        if hasattr(obj, "privacy") and obj_is_not_hidden:
            if request.user.co_owner:
                permission = self.user_has_obj_access(obj, request.user.id) or \
                             self.user_has_obj_access(obj, request.user.co_owner.id)
            else:
                permission = self.user_has_obj_access(obj, request.user.id)
        else:
            permission = self.user_has_obj_access(obj, request.user.id)

        return permission


class OwnsStripeSubscription(BasePermission):

    def has_permission(self, request, view):
        if request.user.account.customer is None:
            return False

        kwargs = view.kwargs
        try:
            sub_ids = self.get_customers_subscription_id(
                request.user.account.customer.id)
            return any(sub_id == kwargs.get("id") for sub_id in sub_ids)
        except Exception as e:  # pragma: no cover
            stripe_logger.error(f"Error checking subscription: {e}")
            return False

    def get_customers_subscription_id(self, customer_id):
        return [
            sub.id for sub in stripe.Subscription.list(
                customer=customer_id, status="all"
            ).data
        ]


class AccountOwner(BasePermission):
    '''
    Checks if the user is the primary user on the account
    '''

    def has_permission(self, request, view):
        return request.user.account.customer.user_id == request.user.id


def is_account_owner(func):

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        request = args[1]
        if not AccountOwner().has_permission(request, None):
            return Response(
                {"error": "You do not have permission to perform this action"},
                status=HTTP_401_UNAUTHORIZED,
            )  # pragma: no cover
        else:
            return func(*args, **kwargs)

    return wrapper
