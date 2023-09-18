from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.views import APIView as ApiView
from rest_framework.response import Response
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
)

from core.serializers import UserSerializer, DeviceSerializer
from core.permissions import IsAal2


class UserView(RetrieveUpdateAPIView):
    """Get me endpoint, returns user data and subscription data"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ThisDeviceView(ApiView):
    '''
    Checks if the ledget_device_token cookie is present,
    doesn't do anything to validate the token, so this endpoint
    should not be used security or anything.
    '''

    def get(self, request, *args, **kwargs):
        # has 'ledget_device_token' cookie
        try:
            request.COOKIES['ledget_device_token']
        except KeyError:
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(status=HTTP_200_OK)


class DeviceViewSet(ModelViewSet):
    permission_classes = [IsAal2]
    serializer_class = DeviceSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        response = Response(serializer.data, HTTP_201_CREATED, headers=headers)
        response.set_cookie(
            key="ledget_device_token",
            value=f"{instance.token}",
            secure=True,
            samesite='None',
        )

        return response

    def perform_create(self, serializer):
        return serializer.save()

    def get_queryset(self):
        return self.request.user.devices.all()

    def get_object(self):
        return self.request.user.devices.get(pk=self.kwargs['pk'])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        # Raise a MethodNotAllowed exception for the PUT and PATCH methods
        raise MethodNotAllowed(
            "PUT", detail="PUT method is not allowed for security reasons")

    def partial_update(self, request, *args, **kwargs):
        # Raise a MethodNotAllowed exception for the PUT method
        raise MethodNotAllowed(
            "PATCH", detail="PATCH method is not allowed for security reasons")
