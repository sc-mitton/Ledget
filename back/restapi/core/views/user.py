import logging
from io import BytesIO
from base64 import b64encode

from rest_framework.generics import (
    RetrieveUpdateAPIView,
    GenericAPIView,
    CreateAPIView
)
from rest_framework.response import Response
from rest_framework import status
import ory_client
from ory_client.api.identity_api import IdentityApi
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.core.exceptions import PermissionDenied
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.image.styles.colormasks import HorizontalGradiantColorMask

from core.serializers.user import (
    UserSerializer,
    EmailSerializer,
    FeedbackSerializer,
    LinkUserSerializer,
    CoOwnerSerializer,
    UserSettingsSerializer
)
from restapi.permissions.auth import (
    IsAuthenticated,
    IsOidcSession,
    HighestAalFreshSession,
    IsTokenBased
)
from restapi.permissions.objects import is_account_owner
from restapi.errors.validation import ValidationError500
from restapi.decorators import csrf_ignore
from core.tasks import cleanup_hanging_ory_users, remove_co_owner


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


class UserSettingsView(RetrieveUpdateAPIView):
    """Get and update user settings"""

    permission_classes = [IsAuthenticated]
    serializer_class = UserSettingsSerializer

    def get_object(self):
        return self.request.user.settings

    def partial_update(self, request, *args, **kwargs):
        if 'mfa_method' in request.data and not \
                HighestAalFreshSession().check_session_is_fresh(request):
            raise PermissionDenied('Cannot change MFA method without fresh session')
        return super().partial_update(request, *args, **kwargs)


class CoOwnerView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CoOwnerSerializer

    def get(self, request):
        try:
            data = self.get_response_data()
            return Response(data, status=status.HTTP_200_OK)
        except ory_client.ApiException as e:
            logger.error(f"Failed to get identity: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @is_account_owner
    def delete(self, request):

        request.user.co_owner.account = None
        request.user.co_owner.save()

        remove_co_owner.delay(request.user.co_owner.id)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_response_data(self):
        if not self.request.user.co_owner:
            return None

        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = IdentityApi(api_client)
            id = str(self.request.user.co_owner.id)
            response = api_instance.get_identity(id=id)
            serializer = self.get_serializer(response.traits)
            return serializer.data


class AddUserToAccountView(GenericAPIView):
    '''
    This view is used to add a user to an account. It creates an identity in ory
    and updates the user in the database.
    '''
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

        response_data = self.generate_activation_link_response_data()
        return Response(response_data, status=status.HTTP_200_OK)

    def generate_activation_link_response_data(self):
        recovery_link = settings.ORY_ACTIVATION_REDIRECT_URL

        qr = qrcode.QRCode(
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            border=2
        )
        qr.add_data(recovery_link)
        mask = HorizontalGradiantColorMask(
            left_color=(39, 54, 104),
            right_color=(89, 113, 192)
        )
        img = qr.make_image(
            image_factory=StyledPilImage,
            module_drawer=RoundedModuleDrawer(),
            color_mask=mask
        )

        buffer = BytesIO()
        img.save(buffer)
        encoded_img = b64encode(buffer.getvalue()).decode()
        data_uri = f"data:image/png;base64,{encoded_img}"

        return {
            'recovery_link_qr': data_uri,
            'recovery_link': recovery_link,
            'expires_at': timezone.now() + timezone.timedelta(
                seconds=settings.ORY_RECOVERY_LINK_EXPIRATION
            )
        }

    def _get_ory_identity_id(self):
        email = self._get_validated_email()

        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = IdentityApi(api_client)
            response = api_instance.list_identities(credentials_identifier=email)

        if response and len(response) > 1:
            raise Exception('Multiple identities found')
        elif response and len(response) == 0:
            raise Exception('No identity found')
        else:
            return response[0]['id']

    def _create_identity(self) -> str:
        email = self._get_validated_email()

        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = IdentityApi(api_client)
            create_response = api_instance.create_identity(create_identity_body={
                "schema_id": settings.ORY_USER_SCHEMA_ID,
                "traits": {'email': email, 'name': {'first': '', 'last': ''}},
                "is_verified": True,
            })

        return create_response['id']

    def _update_or_create_db_user(self, identity_id):
        try:
            user, created = get_user_model().objects.update_or_create(
                id=identity_id,
                account=self.request.user.account
            )
            if created:
                cleanup_hanging_ory_users.apply_async(
                    args=[user.id],
                    countdown=settings.ORY_RECOVERY_LINK_EXPIRATION
                )
        except Exception as e:
            logger.error(f"Failed to update or create user: {e}")
            raise ValidationError500(
                message='Looks like something went wrong, please try again later.',
                code='USER_UPDATE_FAILED'
            )

    def _get_validated_email(self):
        serializer = LinkUserSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data['email']


class UserSessionExtendView(GenericAPIView):
    """Extend user session"""

    permission_classes = [IsAuthenticated, IsOidcSession]

    def patch(self, request):
        try:
            with ory_client.ApiClient(ory_configuration) as api_client:
                api_instance = IdentityApi(api_client)
                api_instance.extend_session(id=request.ory_session.id)
        except ory_client.ApiException as e:
            logger.error(f"Failed to extend session: {e}")
            return Response({'error': 'Failed to extend session'},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)


@method_decorator(csrf_ignore, name='dispatch')
class UserTokenSessionExtendView(GenericAPIView):  # pragma: no cover
    """Extend user session"""

    permission_classes = [IsAuthenticated, IsTokenBased]

    def patch(self, request, *args, **kwargs):
        try:
            with ory_client.ApiClient(ory_configuration) as api_client:
                api_instance = IdentityApi(api_client)
                api_instance.extend_session(id=kwargs['id'])
        except ory_client.ApiException as e:  # pragma: no cover
            logger.error(f"Failed to extend session: {e}")
            return Response({'error': 'Failed to extend session'},
                            status=status.HTTP_400_BAD_REQUEST)
        except ory_client.ApiTypeError as e:  # pragma: no cover
            logger.error(f"Failed to extend session: {e}")
            return Response({'error': 'Failed to extend session'},
                            status=status.HTTP_400_BAD_REQUEST)

        except KeyError:
            return Response({'error': 'session_id is required'},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)


class DisabledSessionView(GenericAPIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            with ory_client.ApiClient(ory_configuration) as api_client:
                api_instance = IdentityApi(api_client)
                api_instance.disable_session(id=request.ory_session.id)
        except ory_client.ApiException as e:  # pragma: no cover
            logger.error(f"Failed to disable session: {e}")
            return Response({'error': 'Failed to disable session'},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)


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
