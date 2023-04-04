
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import ValidationError

from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin

import jwt
from .serializers import (
    CustomTokenRefreshSerializer,
    UserSerializer
)


@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)


cookie_args = {
    'httponly': settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
    'secure': settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
    'max_age': settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
    'domain': settings.SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
    # 'samesite': settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    # # this breaks things in development
}


def _decode_jwt(token):
    decoded_jwt = jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=['HS256']
    )
    return decoded_jwt


class CookieTokenObtainPairView(TokenObtainPairView):
    """Custom view that extends the default TokenObtainPairView
    in order to set the refresh token as a HTTP only cookie."""

    def finalize_response(self, request, response, *args, **kwargs):

        if response.data.get('refresh'):
            response.set_cookie(
                'refresh',
                response.data['refresh'],
                **cookie_args
            )
            response.set_cookie(
                'access',
                response.data['access'],
                **cookie_args
            )
            decoded_access_jwt = _decode_jwt(response.data['access'])
            payload = {
                'user': decoded_access_jwt['user'],
                'access_token_expiration': decoded_access_jwt['exp']
            }
            response.data.update(payload)
            del response.data['refresh']
            del response.data['access']

        return super().finalize_response(request, response, *args, **kwargs)


class CreateUserView(CookieTokenObtainPairView):
    """Custom view for creating a new user and returning
    token pair."""

    def post(self, request, *args, **kwargs):

        user_serializer = UserSerializer(data=request.data)
        try:
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        except ValidationError as e:
            return Response(e.args[0], status=HTTP_400_BAD_REQUEST)

        response = super().post(request, *args, **kwargs)
        response.status_code = HTTP_201_CREATED

        return response


class UpdateUserView(LoginRequiredMixin, APIView):
    """View for updating user information."""

    def patch(self, request, *args, **kwargs):
        user = request.user
        user_serializer = UserSerializer(user, data=request.data, partial=True)

        try:
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        except ValidationError as e:
            return Response(e.args[0], status=HTTP_400_BAD_REQUEST)

        return Response(user_serializer.data, status=HTTP_200_OK)


class CookieTokenRefreshView(LoginRequiredMixin, TokenRefreshView):
    """Custom view that extends the default TokenRefreshView
    in order to set the refresh token as a HTTP only cookie."""

    serializer_class = CustomTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.COOKIES,
        )

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=HTTP_200_OK)

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            # If the refresh token is expired, this block wont ever
            # get exeuted
            response.set_cookie(
                'access',
                response.data['access'],
                **cookie_args
            )
            response.set_cookie(
                'refresh',
                response.data['refresh'],
                **cookie_args
            )
            decoded_access_jwt = _decode_jwt(response.data['access'])
            payload = {
                'user': decoded_access_jwt['user'],
                'access_token_expiration': decoded_access_jwt['exp']
            }
            response.data.update(payload)
            del response.data['refresh']
            del response.data['access']

        return super().finalize_response(request, response, *args, **kwargs)


class LogoutView(TokenBlacklistView):
    """Custom view for logging out a user."""

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.COOKIES,
        )

        # validating the token will blacklist it
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=HTTP_200_OK)
