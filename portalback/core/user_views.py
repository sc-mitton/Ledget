
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from django.core.exceptions import ValidationError
from django.conf import settings
from django.contrib.auth import get_user_model

from .serializers import (
    CustomTokenRefreshSerializer,
    UserSerializer
)


cookie_args = {
    'httponly': settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
    'secure': settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
    'max_age': settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
    'domain': settings.SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
    'samesite': settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
}


@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)


class CookieTokenObtainPairView(TokenObtainPairView):
    """Custom view that extends the default TokenObtainPairView
    in order to set the refresh token as a HTTP only cookie."""

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            response.set_cookie(
                'refresh_token',
                response.data,
                **cookie_args
            )
            del response.data['refresh']
            del response.data['access']
        return super().finalize_response(request, response, *args, **kwargs)


class CreateUserView(CookieTokenObtainPairView):
    """Custom view for obtaining token pair when logging in."""
    user_serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):

        try:
            user_serializer = self.user_serializer_class(data=request.data)
            if user_serializer.is_valid(raise_exception=True):
                get_user_model().objects.create_user(
                    email=request.data['email'],
                    password=request.data['password']
                )

            response = super().post(request, *args, **kwargs)
            response.status_code = HTTP_201_CREATED
        except ValidationError:
            response = Response({'error': 'Wrong email or password.'},
                                status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            response = Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

        return response


class CookieTokenRefreshView(TokenRefreshView):
    """Custom view that extends the default TokenRefreshView
    in order to set the refresh token as a HTTP only cookie."""

    serializer_class = CustomTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            response.set_cookie(
                'refresh_token',
                response.data['access'],
                **cookie_args
            )
            del response.data['refresh']
            del response.data['access']
        return super().finalize_response(request, response, *args, **kwargs)
