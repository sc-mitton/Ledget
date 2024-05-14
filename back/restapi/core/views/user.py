import logging

from rest_framework.generics import RetrieveUpdateAPIView, GenericAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework import status
import ory_client
from ory_client.api.identity_api import IdentityApi
from django.conf import settings
from django.contrib.auth import get_user_model

from core.serializers.user import (
    UserSerializer,
    EmailSerializer,
    FeedbackSerializer,
    LinkUserSerializer,
    ActivationLinkQrSerializer
)
from restapi.permissions.auth import (
    IsAuthenticated,
    HasOidcSignin,
    HighestAalFreshSession
)

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


class AddUserToAccountView(GenericAPIView):
    permission_classes = [HighestAalFreshSession]

    def post(self, request):

        activation_link = self._get_activation_link()
        data = ActivationLinkQrSerializer({"activation_link": activation_link}).data

        return Response(data, status=status.HTTP_204_NO_CONTENT)

    def _get_activation_link(self):

        try:
            identity_id = self._create_identity()
            activation_link = self._create_activation_link(identity_id)
        except Exception as e:
            logger.error(f"Failed to create identity: {e}")
            return Response(
                data={
                    'error': 'Failed to create identity',
                    'code': 'identity_creation_failed'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return activation_link

    def _create_activation_link(self, user_id):
        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = IdentityApi(api_client)
            create_response = api_instance.create_recovery_link_for_identity(
                id=user_id,
                body={"expires_in": settings.ORY_RECOVERY_LINK_EXPIRATION}
            )
            return create_response['recovery_link']['link']

    def _get_identity_id(self):

        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = IdentityApi(api_client)
            identity = api_instance.get_identity()
            get_user_model().objects.create(
                account=self.request.user.account,
                id=identity['id'],
                is_onboarded=True
            )
        return identity['id']

    def _create_identity(self):
        email = self._get_validated_serializer_data()

        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = IdentityApi(api_client)
            create_response = api_instance.create_identity(
                body={
                    "schema_id": settings.ORY_USER_SCHEMA_ID,
                    "traits": {**email, 'name': {'first': '', 'last': ''}}
                }
            )
        return create_response['id']

    def _get_validated_serializer_data(self):
        serializer = LinkUserSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data


class UserSessionExtendView(GenericAPIView):
    """Extend user session"""

    permission_classes = [IsAuthenticated, HasOidcSignin]

    def patch(self, request):
        try:
            with ory_client.ApiClient(ory_configuration) as api_client:
                api_instance = IdentityApi(api_client)
                api_instance.extend_session(id=self.request.ory_session.id)
        except ory_client.ApiException as e:
            logger.error(f"Failed to extend session: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)


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
