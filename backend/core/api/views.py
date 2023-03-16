
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.conf import settings

from .serializers import UserSerializer, CustomTokenObtainPairSerializer


def _set_jwt_cookie(response, data) -> Response:
    """Creates a cookiie with the JWT token pair and
    returns it in the response with a 200 status code."""
    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=data,
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        max_age=settings.SIMPLE_JWT[
            'ACCESS_TOKEN_LIFETIME'
        ].total_seconds(),
        domain=settings.SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )
    print(f"DEBUGGING: I'M IN THE _set_jwt_cookie FUNCTION")
    return response


class CustomTokenObtainPairView(TokenObtainPairView):
    """Class for creating JWT token pair when a user logs in."""

    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid(raise_exception=True):
            response = Response(serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            user = serializer.validated_data.get('user') or request.user
            data = self.get_token_for_user(user)
            response = Response(data, status=status.HTTP_200_OK)
            response = _set_jwt_cookie(response, data)

        return response

    def get_token_for_user(self, user):
        refresh = self.get_token(user)
        data = {'refresh': str(refresh),
                'access': str(refresh.access_token)}
        return data


class CustomTokenRefreshView(TokenRefreshView):


@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)


class CreateUserView(CreateAPIView, CustomTokenObtainPairSerializer):
    serializer_class = UserSerializer
    token_serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 201:
            user = get_user_model().objects.get(email=request.data['email'])
            refresh = self.token_serializer_class.get_token(user=user)

            data = {'refresh': str(refresh),
                    'access': str(refresh.access_token)}

            response = _set_jwt_cookie(response, data)

        return response
