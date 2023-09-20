from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.status import HTTP_200_OK
from rest_framework.permissions import IsAuthenticated

from core.serializers import DeviceSerializer


def put_patch_not_allowed(func):
    # Raise a MethodNotAllowed exception for the PUT and PATCH methods
    def wrapper(self, request, *args, **kwargs):
        if request.method == 'PUT' or request.method == 'PATCH':
            raise MethodNotAllowed(
                f"{request.method}",
                detail=f"{request.method} method is not allowed.")
        return func(self, request, *args, **kwargs)
    return wrapper


class DeviceViewSet(ModelViewSet):
    '''
    Device viewset for handling the remembered devices of the user.
    '''
    permission_classes = [IsAuthenticated]
    serializer_class = DeviceSerializer

    def create(self, request, *args, **kwargs):
        device_has_been_aal2 = request.user.device.aal == 'aal2'
        user_has_mfa = request.user.authenticator_enabled

        if not device_has_been_aal2 and user_has_mfa:
            return Response({'data': {'messageId': 'needs_aal2'}})
        elif not request.user.device:
            instance = self.add_device(request, *args, **kwargs)
        else:
            instance = self.update(request, *args, **kwargs)

        response = Response(status=HTTP_200_OK)
        response.set_cookie(
            key="ledget_device_token",
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
        return self.request.user.devices.all()

    def get_object(self):
        return self.request.user.device

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=HTTP_200_OK)

    @put_patch_not_allowed
    def partial_update(self, request, *args, **kwargs):
        pass
