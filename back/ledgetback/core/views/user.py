
from rest_framework.generics import RetrieveUpdateAPIView

from core.serializers import UserSerializer
from core.permissions import IsAuthenticated


class UserView(RetrieveUpdateAPIView):
    """Get me endpoint, returns user data and subscription data"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
