
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from django.contrib.auth import get_user_model
from django.conf import settings

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer
)


def _set_jwt_cookie(response, token) -> Response:
    """Creates a cookiie with the JWT token pair and
    returns it in the response with a 200 status code."""
    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=token,
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        max_age=settings.SIMPLE_JWT[
            'ACCESS_TOKEN_LIFETIME'
        ].total_seconds(),
        domain=settings.SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )
    return response


class LoginTokenObtainPairView(TokenObtainPairView):
    """Class for creating JWT token pair when a user logs in."""
    token_serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        password = request.data.get('password')
        email = request.data.get('email')
        user = get_user_model().objects.get(email=email)
        if user and user.check_password(password):
            refresh = self.token_serializer_class.get_token(user=user)
            token = {
                'refresh': refresh,
                'access': refresh.access_token
            }
            response = _set_jwt_cookie(Response(status.HTTP_200_OK), token)
        else:
            response = Response(status.HTTP_401_UNAUTHORIZED)
        return response


class CustomTokenRefreshView(TokenRefreshView):
    pass


@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)


class CreateUserView(CreateAPIView):
    token_serializer_class = CustomTokenObtainPairSerializer
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 201:
            user = get_user_model().objects.get(email=request.data['email'])
            refresh = self.token_serializer_class.get_token(user=user)

            token = {
                'refresh': refresh,
                'access': refresh.access_token
            }

            response = _set_jwt_cookie(response, token)

        return response
