from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model


class UserSerializer(ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'first_name', 'last_name', 'is_staff')

    def create_user(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user
