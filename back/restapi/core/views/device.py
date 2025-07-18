from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_422_UNPROCESSABLE_ENTITY
from rest_framework.permissions import IsAuthenticated as CoreIsAuthenticated
from rest_framework.generics import (
    ListCreateAPIView,
    DestroyAPIView,
)
from django.utils.decorators import method_decorator
import secrets
import string

from core.serializers.device import DeviceSerializer
from restapi.permissions.auth import IsAuthenticated, Aal1FreshSession
from restapi.permissions.objects import IsObjectOwner
from core.models import Device
from restapi.decorators import csrf_ignore, ensure_csrf_cookie


def generate_random_string(length=6):
    alphabet = string.ascii_letters
    return ''.join(secrets.choice(alphabet) for _ in range(length))


@method_decorator(ensure_csrf_cookie, name='dispatch')
@method_decorator(csrf_ignore, name='dispatch')
class DeviceView(ListCreateAPIView):
    permission_classes = [CoreIsAuthenticated, IsObjectOwner]
    serializer_class = DeviceSerializer

    def create(self, request, *args, **kwargs):
        device_is_aal1 = not request.device or request.device.aal == 'aal1'
        session_is_aal1 = request.ory_session.aal == 'aal1'
        user_has_mfa = bool(request.user.settings.mfa_method)

        # can't create new device when user has mfa set up and the session is aal1
        if (device_is_aal1 and session_is_aal1) and user_has_mfa:
            return Response(
                {'error': f'{request.user.settings.mfa_method}'.upper()},
                HTTP_422_UNPROCESSABLE_ENTITY
            )
        elif not request.device:
            instance = self._add_device(request, *args, **kwargs)
        else:
            instance = self.update(request, *args, **kwargs)

        response = Response(
            data={'device_token': instance.token},
            status=HTTP_200_OK)
        response = self._set_cookies(response, instance)
        return response

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer()
        instance = self.get_object()
        serializer.update(instance)

        return instance

    def get_queryset(self):
        return Device.objects.filter(user=self.request.user)

    def get_object(self, ):
        return self.request.device

    def _set_cookies(self, response, device):
        response.set_cookie(
            key=f"ledget_device${generate_random_string()}",
            value=f"{device.token}",
            secure=True,
            samesite='None',
            httponly=True,
        )
        # Unset all previous device cookies
        for key in [k for k in self.request.COOKIES.keys() if 'ledget_device' in k]:
            response.set_cookie(key=key, value='', max_age=0)

        return response

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
