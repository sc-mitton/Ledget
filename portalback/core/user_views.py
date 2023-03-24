
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_200_OK
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings
from django.contrib.auth import get_user_model


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
    'samesite': settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
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
            decoded_jwt = _decode_jwt(response.data['access'])
            response.data['email'] = decoded_jwt['email']
            response.data['full_name'] = decoded_jwt['full_name']
            response.data['expiration'] = decoded_jwt['exp']
            del response.data['refresh']
            del response.data['access']

        return super().finalize_response(request, response, *args, **kwargs)


class CreateUserView(CookieTokenObtainPairView):
    """Custom view for creating a new user and returning
    token pair ."""

    def post(self, request, *args, **kwargs):

        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid(raise_exception=True):
            get_user_model().objects.create_user(
                email=request.data['email'],
                password=request.data['password']
            )

        response = super().post(request, *args, **kwargs)
        response.status_code = HTTP_201_CREATED

        return response


class CookieTokenRefreshView(TokenRefreshView):
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
            # If the refresh token is expird, this block wont ever
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
            decoded_jwt = _decode_jwt(response.data['access'])
            response.data['email'] = decoded_jwt['email']
            response.data['full_name'] = decoded_jwt['full_name']
            response.data['expiration'] = decoded_jwt['exp']
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
