from django.contrib.auth.mixins import UserPassesTestMixin
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import redirect
from django.http import HttpResponseRedirect


class JWTAuthMixin(UserPassesTestMixin):
    """
    Mixin to check JWT token in requests.
    """
    authentication_classes = [JWTAuthentication]

    def test_func(self):
        try:
            self.request.user.token
        except (AttributeError, InvalidToken, TokenError):
            return False
        else:
            return True

    def handle_no_permission(self) -> HttpResponseRedirect:
        return redirect('login')
