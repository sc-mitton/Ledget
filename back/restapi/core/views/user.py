import logging

from rest_framework.generics import RetrieveUpdateAPIView, GenericAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework import status
import ory_client
from ory_client.api import identity_api
from django.conf import settings

from core.serializers.user import UserSerializer, EmailSerializer, FeedbackSerializer
from restapi.permissions.auth import IsAuthenticated, HasOidcSignin

ory_configuration = ory_client.Configuration(
    host=settings.ORY_HOST, access_token=settings.ORY_API_KEY
)

logger = logging.getLogger("ledget")


class UserView(RetrieveUpdateAPIView):
    """Get me endpoint, returns user data and subscription data"""

    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserSessionExtendView(GenericAPIView):
    """Extend user session"""

    permission_classes = [IsAuthenticated, HasOidcSignin]

    def patch(self, request):
        try:
            with ory_client.ApiClient(ory_configuration) as api_client:
                api_instance = identity_api.IdentityApi(api_client)
                api_instance.extend_session(id=self.request.ory_session.id)
        except ory_client.ApiException as e:
            logger.error(f"Failed to extend session: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmailView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EmailSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(status=status.HTTP_204_NO_CONTENT)


class FeedbackView(CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]
