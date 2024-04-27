import logging

from rest_framework.permissions import BasePermission

import stripe
from django.conf import settings

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
        except AttributeError:
            return False

    def has_read_access(self, request, obj):

        return self.user_has_obj_access(
            obj, request.user.id
        ) or self.user_has_obj_access(obj, request.user.co_owner.id)

    def has_write_access(self, request, obj):
        obj_is_shared = hasattr(obj, "privacy") and obj.privacy == "shared"

        if not hasattr(obj, "privacy") or obj_is_shared:
            has_obj_access = self.user_has_obj_access(obj, request.user.id)
            user_is_co_owner = self.user_has_obj_access(obj, request.user.co_owner.id)
            return has_obj_access or user_is_co_owner
        else:
            return self.user_has_obj_access(obj, request.user.id)

    def user_has_obj_access(self, obj, user_id):
        if hasattr(obj, "users"):
            return user_id in obj.users.all().values_list("id", flat=True)
        else:
            return user_id == obj.id or id == obj.user_id


class HasObjectAccessLooseWrite(HasObjectAccess):

    def has_write_access(self, request, obj):
        '''
        Override write access method to allow users with shared access to edit
        '''
        obj_is_not_hidden = hasattr(obj, "privacy") and obj.privacy != "hidden"

        if not hasattr(obj, "privacy") or obj_is_not_hidden:
            has_obj_access = self.user_has_obj_access(obj, request.user.id)
            user_is_co_owner = self.user_has_obj_access(obj, request.user.co_owner.id)
            return has_obj_access or user_is_co_owner
        else:
            return self.user_has_obj_access(obj, request.user.id)


class OwnsStripeSubscription(BasePermission):

    def has_permission(self, request, view):
        kwargs = view.kwargs
        try:
            sub_id = self.get_subscription_id(request.user.account.customer.id)
            return sub_id == kwargs.get("sub_id")
        except Exception as e:
            stripe_logger.error(f"Error checking subscription: {e}")
            return False

    def get_subscription_id(self, customer_id):
        return stripe.Subscription.list(customer=customer_id).data[0].id
