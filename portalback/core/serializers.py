
from rest_framework import serializers
from django.contrib.auth import get_user_model
from core.models import Customer
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from rest_framework_simplejwt.exceptions import InvalidToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        write_only_fields = ('password')
        op_kwargs = {'first_name': {'required': False},
                     'last_name': {'required': False}}
        extra_kwargs = {'email': {'validators': []}}

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def validate_email(self, value):
        if get_user_model().objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is already taken.',
                                              code='unique')
        if not value:
            raise serializers.ValidationError('Email is required.')
        return value

    def validate_password(self, value):
        # validate password
        if not value:
            raise serializers.ValidationError('Password is required')
        if len(value) < 8:
            raise serializers.ValidationError(
                'Password must be at least 8 characters long')
        return value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer for jwt token pair, that adds email
    and full name to the token payload."""

    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)
        token['email'] = user.email
        token['full_name'] = user.full_name

        return token


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken(
                "No valid token found in cookie 'token'")


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['user_id', 'first_name', 'last_name', 'stripe_customer_id',
                  'stripe_subscription_id']
        read_only_fields = ['user_id', 'stripe_customer_id',
                            'stripe_subscription_id']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
