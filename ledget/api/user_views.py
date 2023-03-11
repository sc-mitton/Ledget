from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .serializers import UserSerializer


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as error:
            is_unique_error = 'unique' in error.detail['email'][0].lower()
            if 'email' in error.detail and is_unique_error:
                msg = {'email': 'Email is already taken.'}
                return Response(msg, status=status.HTTP_400_BAD_REQUEST)
            raise

# TODO - add a view to update a user's password
# TODO - add a view to update a user's email
# TODO - add a view to update a user's name
# TODO - add view to sign up a customer
