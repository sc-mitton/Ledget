
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from rest_framework_simplejwt.exceptions import InvalidToken
import stripe

from core.models import (
    Customer,
    Subscription,
    Price
)


stripe.api_key = settings.STRIPE_SK


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for customer model"""

    class Meta:
        model = Customer
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(required=False)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'customer')
        write_only_fields = ('password',)
        extra_kwargs = {'email': {'validators': []}}

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        customer_data = validated_data.pop('customer', None)
        if customer_data:
            customer, created = Customer.objects.update_or_create(
                user=instance,
                defaults=customer_data
            )
            if created:
                customer.save()

        # password should be updated via separate endpoint
        validated_data.pop('password', None)

        user = super().update(instance, validated_data)
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
            'id': str(user.id),
            'full_name': user.full_name,
        }

        return token


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid token found in cookie 'token'")


class PriceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Price
        fields = (
            'id', 'unit_amount', 'currency', 'active', 'created',
            'lookup_key', 'description', 'contract_length', 'trial_period_days'
        )


class SubscriptionSerializer(serializers.ModelSerializer):
    price = PriceSerializer()

    class Meta:
        models = Subscription
        fields = ('price')

    def create(self, validated_data):
        """Method for creating a subscription """

        user = self.context['request'].user
        if not hasattr(user, 'customer'):
            Customer.objects.create(user=user)

        subscription = Subscription.objects.create(
            customer=user.customer,
            **validated_data
        )

        return subscription
