from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

authenticator = JWTAuthentication()


class JWTRequestUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            valid_token = authenticator.get_validated_token(
                            request.COOKIES.get('access'))
            user = authenticator.get_user(valid_token)
            request.user = user
        except TokenError:
            request.user = AnonymousUser()
        except InvalidToken:
            request.user = AnonymousUser()

        response = self.get_response(request)
        return response
