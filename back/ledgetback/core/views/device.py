from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST
)
from rest_framework.routers import Route, SimpleRouter
from rest_framework.permissions import IsAuthenticated as CoreIsAuthenticated
from rest_framework.generics import GenericAPIView
from django.conf import settings
import messagebird

from core.serializers import DeviceSerializer, OtpSerializer
from core.permissions import IsObjectOwner, IsAuthenticated
from core.models import Device


BIRD_API_KEY = settings.BIRD_API_KEY
BIRD_SIGNING_KEY = settings.BIRD_SIGNING_KEY
mbird_client = messagebird.Client(BIRD_API_KEY)


def put_patch_not_allowed(func):
    # Raise a MethodNotAllowed exception for the PUT and PATCH methods
    def wrapper(self, request, *args, **kwargs):
        if request.method == 'PUT' or request.method == 'PATCH':
            raise MethodNotAllowed(
                f"{request.method}",
                detail=f"{request.method} method is not allowed.")
        return func(self, request, *args, **kwargs)
    return wrapper


class CustomDeviceRouter(SimpleRouter):
    routes = [
        Route(
            url=r'^{prefix}$',
            mapping={'post': 'create', 'get': 'list'},
            name='{basename}-list',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),
        Route(
            url=r'^{prefix}/{lookup}$',
            mapping={'delete': 'destroy'},
            name='{basename}-destroy',
            detail=True,
            initkwargs={'suffix': 'Destroy'}
        )
    ]


class DeviceViewSet(ModelViewSet):
    '''
    Device viewset for handling the remembered devices of the user.
    '''
    permission_classes = [CoreIsAuthenticated, IsObjectOwner]
    serializer_class = DeviceSerializer

    def create(self, request, *args, **kwargs):
        device_not_aal2 = not request.user.device \
                               or request.user.device.aal != 'aal2'
        session_is_aal1 = request.user.session_aal == 'aal1'

        if (device_not_aal2 and session_is_aal1) and bool(request.user.mfa_method):
            return Response(
                {'error': f'{request.user.mfa_method}'},
                HTTP_422_UNPROCESSABLE_ENTITY
            )
        elif not request.user.device:
            instance = self.add_device(request, *args, **kwargs)
        else:
            instance = self.update(request, *args, **kwargs)

        response = Response(status=HTTP_200_OK)
        response.set_cookie(
            key="ledget_device",
            value=f"{instance.token}",
            secure=True,
            samesite='None',
        )
        return response

    @put_patch_not_allowed
    def update(self, request, *args, **kwargs):
        # Raise a MethodNotAllowed exception for the PUT and PATCH methods
        serializer = self.get_serializer(self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = self.get_object()
        serializer.update(instance, serializer.validated_data)

        return instance

    def add_device(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return serializer.save()

    def get_queryset(self):
        return Device.objects.filter(user=self.request.user)

    def get_object(self, id=None):
        if id:
            object = Device.objects.get(id=id)
        else:
            object = self.request.user.device

        self.check_object_permissions(self.request, object)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object(id=kwargs.get('pk'))
        self.perform_destroy(instance)
        return Response(status=HTTP_204_NO_CONTENT)

    @put_patch_not_allowed
    def partial_update(self, request, *args, **kwargs):
        pass


class OtpView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OtpSerializer

    def post(self, request, *arg, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data['phone'])

        try:
            verify = mbird_client.verify_create(
                recipient=serializer.validated_data['phone'],
            )
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
                {'error': 'Invalid OTP'},
                HTTP_400_BAD_REQUEST
            )
        if verify.status != 'verified':
            return Response(
                {'error': 'Invalid OTP'},
                HTTP_400_BAD_REQUEST
            )

        self.request.user.phone_number = verify.recipient
        self.request.user.mfa_method = 'otp'
        self.request.user.device.aal = 'aal1.5'
        self.request.user.save()

        return Response({'data': {id: verify.id}}, HTTP_200_OK)
