
from rest_framework.generics import RetrieveUpdateAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from core.serializers import UserSerializer, EmailSerializer
from core.permissions import IsAuthenticated


class UserView(RetrieveUpdateAPIView):
    """Get me endpoint, returns user data and subscription data"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        print('request.session', self.request.session)
        return self.request.user


class EmailView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EmailSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(status=status.HTTP_204_NO_CONTENT)
