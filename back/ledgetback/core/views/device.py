from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_400_BAD_REQUEST
)
from rest_framework.permissions import IsAuthenticated as CoreIsAuthenticated
from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    DestroyAPIView,
)
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.utils.decorators import method_decorator
import messagebird

from core.serializers import DeviceSerializer, OtpSerializer
from core.permissions import (
    IsObjectOwner,
    IsAuthenticated,
    Aal1FreshSession,
    highest_aal_freshness
)
from core.models import Device
from ledgetback.decorators import csrf_ignore, ensure_csrf_cookie


BIRD_API_KEY = settings.BIRD_API_KEY
BIRD_SIGNING_KEY = settings.BIRD_SIGNING_KEY
mbird_client = messagebird.Client(BIRD_API_KEY)


@method_decorator(ensure_csrf_cookie, name='dispatch')
@method_decorator(csrf_ignore, name='dispatch')
class DeviceView(ListCreateAPIView):
    permission_classes = [CoreIsAuthenticated, IsObjectOwner]
    serializer_class = DeviceSerializer

    def create(self, request, *args, **kwargs):
        device_is_aal1 = not request.user.device or request.user.device.aal == 'aal1'
        session_is_aal1 = request.user.session_aal == 'aal1'
        use_has_mfa = bool(request.user.mfa_method)

        # can't create new device when user has mfa set up
        if (device_is_aal1 and session_is_aal1) and use_has_mfa:
            return Response(
                {'error': f'{request.user.mfa_method}'},
                HTTP_422_UNPROCESSABLE_ENTITY
            )
        elif not request.user.device:
            instance = self._add_device(request, *args, **kwargs)
        else:
            instance = self.update(request, *args, **kwargs)

        response = Response(status=HTTP_200_OK)
        response.set_cookie(
            key="ledget_device",
            value=f"{instance.token}",
            secure=True,
            samesite='None',
            httponly=True,
        )
        return response

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer()
        instance = self.get_object()
        serializer.update(instance)

        return instance

    def get_queryset(self):
        return Device.objects.filter(user=self.request.user)

    def get_object(self, ):
        return self.request.user.device

    def _add_device(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return serializer.save()


class DestroyDeviceView(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsObjectOwner, Aal1FreshSession]
    serializer_class = DeviceSerializer

    def get_object(self):
        obj = Device.objects.get(id=self.kwargs['id'])
        self.check_object_permissions(self.request, obj)
        return obj


class OtpView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OtpSerializer

    @highest_aal_freshness
    def post(self, request, *arg, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recipient = '{}{}'.format(
            serializer.validated_data['country_code'],
            serializer.validated_data['phone']
        )

        try:
            verify = mbird_client.verify_create(recipient=int(recipient))
        except messagebird.client.ErrorException as e:
            return Response(
                {'error': e.message},
                status=HTTP_400_BAD_REQUEST
            )

        return Response({'data': {'id': verify.id}}, HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        id = kwargs.get('otp_id')
        try:
            verify = mbird_client.verify.verify(id, serializer.validated_data['code'])
        except Exception as e: # noqa
            return Response(
                {'error': 'Invalid code'},
                HTTP_400_BAD_REQUEST
            )
        if verify.status != 'verified':
            return Response(
                {'error': 'Invalid code'},
                HTTP_400_BAD_REQUEST
            )

        self._update_objects(request, serializer_data=serializer.validated_data)

        return Response({'data': {id: verify.id}}, HTTP_200_OK)

    @transaction.atomic
    def _update_objects(self, request, serializer_data):

        if request.user.mfa_method != 'otp':
            self.request.user.phone_number = serializer_data['phone_number']
            self.request.user.phone_country_code = serializer_data['country_code']
            self.request.user.mfa_method = 'otp'
            self.request.user.device.aal = 'aal15'
            self.request.user.device.save()
        else:
            # update otp verification details
            self.request.user.last_otp_verification = timezone.now()

        self.request.user.save()
