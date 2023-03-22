
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_201_CREATED,
    HTTP_200_OK
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from rest_framework_simplejwt.exceptions import TokenError
from django.core.exceptions import ValidationError
from django.conf import settings
from django.contrib.auth import get_user_model

import jwt
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

    def decode_jwt(self, token):
        decoded_jwt = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=['HS256']
        )
        return decoded_jwt

    def finalize_response(self, request, response, *args, **kwargs):
        print(request.data)
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

            decoded_jwt = self.decode_jwt(response.data['access'])
            email = decoded_jwt['email']
            full_name = decoded_jwt['full_name']
            response.data['email'] = email
            response.data['full_name'] = full_name
            del response.data['refresh']
            del response.data['access']
            print(f"DEBUGGING {response}")

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

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.COOKIES,
        )

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            return Response({'error': str(e)}, status=HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

        return Response(serializer.validated_data, status=HTTP_200_OK)

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            # If the refresh token is expird, this block wont ever
            # get exeuted
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
            del response.data['refresh']
            del response.data['access']
        return super().finalize_response(request, response, *args, **kwargs)
