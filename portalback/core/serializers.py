
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from rest_framework_simplejwt.exceptions import InvalidToken

from core.models import BillingInfo


class BillingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingInfo
        fields = ['city', 'state', 'postal_code']


class UserSerializer(serializers.ModelSerializer):
    billing_info = BillingInfoSerializer(required=False)

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'password', 'first_name',
                  'last_name', 'billing_info']
        write_only_fields = ('password',)
        extra_kwargs = {'email': {'validators': []}}

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):

        billing_info = validated_data.pop('billing_info', None)
        if billing_info:
            BillingInfo.objects.update_or_create(
                user=instance,
                **billing_info
            )

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
        if len(value) < 10:
            raise serializers.ValidationError(
                'Password must be at least 10 characters long'
            )
        return value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer for jwt token pair, that adds email
    and full name to the token payload."""

    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)
        token['user'] = {
            'email': user.email,
            'full_name': user.full_name
        }
        if hasattr(user, 'customer'):
            token['user']['is_customer'] = user.customer.is_active

        return token


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken(
                "No valid token found in cookie 'token'")
