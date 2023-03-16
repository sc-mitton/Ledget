
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.tokens import Token
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model


from .serializers import UserSerializer, CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """Class for creating JWT token pair when a user logs in."""

    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):

            user = serializer.validated_data.get('user') or request.user
            if user.is_active:
                refresh = self.get_token(user)
                data = {'refresh': str(refresh),
                        'access': str(refresh.access_token)}
                return Response(data, status=status.HTTP_200_OK)


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
        return Response(data, status=response.status_code)
