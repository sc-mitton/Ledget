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
    permission_classes = [HighestAalFreshSession, IsAuthenticated]

    def post(self, request):

        # Create or get the ory identity id
        identity_id = None
        try:
            identity_id = self._create_identity()
        except ory_client.ApiException as e:
            if e.status == 409 and e.reason == 'Conflict':
                identity_id = self._get_ory_identity_id()
            else:
                logger.error(f"Failed to create identity: {e}")
                return Response(
                    data={
                        'error': 'Failed to create identity',
                        'code': 'identity_creation_failed'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        finally:
            self._update_or_create_db_user(identity_id)

        # Create activation link and return it
        recovery_link = None
        try:
            recovery_link = self._create_activation_link(identity_id)
        except Exception as e:
            logger.error(f"Failed to create activation link: {e}")
            return Response(
                data={
                    'error': 'Failed to create activation link',
                    'code': 'activation_link_creation_failed'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        s = ActivationLinkQrSerializer(recovery_link)
        return Response(s.data, status=status.HTTP_200_OK)

    def _create_activation_link(self, user_id):
        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = IdentityApi(api_client)
            recovery_link = api_instance.create_recovery_link_for_identity({
                "expires_in": settings.ORY_RECOVERY_LINK_EXPIRATION,
                'identity_id': user_id
            })
            return recovery_link

    def _get_ory_identity_id(self):
        email = self._get_validated_email()

        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = IdentityApi(api_client)
            identity = api_instance.list_identities(credentials_identifier=email)

        return identity['id']

    def _create_identity(self) -> str:
        email = self._get_validated_email()

        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = IdentityApi(api_client)
            create_response = api_instance.create_identity({
                "schema_id": settings.ORY_USER_SCHEMA_ID,
                "traits": {'email': email, 'name': {'first': '', 'last': ''}}
            })
        return create_response['id']

    def _update_or_create_db_user(self, identity_id):
        get_user_model().objects.update_or_create(
            id=identity_id,
            account=self.request.user.account,
            is_onboarded=True
        )

    def _get_validated_email(self):
        serializer = LinkUserSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data['email']


class UserSessionExtendView(GenericAPIView):
    """Extend user session"""

    permission_classes = [IsAuthenticated, HasOidcSignin]

    def patch(self, request):
        try:
            with ory_client.ApiClient(ory_configuration) as api_client:
                api_instance = IdentityApi(api_client)
                api_instance.extend_session(id=request.ory_session.id)
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
