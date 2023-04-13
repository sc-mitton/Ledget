
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_200_OK,
)
from rest_framework.decorators import api_view
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

import jwt

from .serializers import (
    CustomTokenRefreshSerializer,
    UserSerializer,
    CustomerSerializer
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
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()

        response = super().post(request, *args, **kwargs)
        response.status_code = HTTP_201_CREATED
        return response


class UpdateUserView(UpdateAPIView):
    serializer_class = CustomerSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


class CookieTokenRefreshView(TokenRefreshView):
    """Custom view that extends the default TokenRefreshView
    in order to set the refresh token as a HTTP only cookie."""
    serializer_class = CustomTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.COOKIES,
        )
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data, status=HTTP_200_OK)

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh') and response.status_code == 200:
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

        data = {}
        if 'access' in request.COOKIES:
            data['access'] = request.COOKIES.get('access')
        if 'refresh' in request.COOKIES:
            data['refresh'] = request.COOKIES.get('refresh')
        if not data:
            return Response(status=HTTP_200_OK)

        serializer = self.get_serializer(
            data=data,
        )
        # validating the token will blacklist it
        serializer.is_valid(raise_exception=True)

        response = Response(serializer.validated_data, status=HTTP_200_OK)
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response
