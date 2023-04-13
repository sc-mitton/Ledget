
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.serializers import ValidationError
import stripe

from core.models import (
    Customer,
    Price,
)


stripe.api_key = settings.STRIPE_SK


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for customer model"""

    class Meta:
        model = Customer
        fields = ['city', 'state', 'postal_code',
                  'first_name', 'last_name']

    def create_stripe_customer(self):
        """Create and return a new stripe customer."""
        validated_data = self.validated_data

        user = self.context['request'].user
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']

        address_items = ['city', 'state', 'postal_code']
        address = {item: validated_data[item] for item in address_items}
        address['country'] = 'US'  # hardcode country for now

        customer = stripe.Customer.create(
            email=user.email,
            name=first_name + ' ' + last_name,
            address=address,
        )
        return customer


class UserSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(required=False)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'customer')
        write_only_fields = ('password',)
        extra_kwargs = {'email': {'validators': []}}

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)

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
                'Password must be at least 10 characters long.'
            )
        return value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer for jwt token pair, that adds email
    and full name to the token payload."""

    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)
        token['user'] = {
            'is_customer': user.is_customer,
            'has_default_payment_method': user.has_default_payment_method,
            'subscription_status': user.subscription_status,
            'email': user.email,
        }
        return token


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        try:
            validated_data = super().validate(attrs)
            return validated_data
        except TokenError:
            raise ValidationError('Refresh token is invalid or expired.')
        except InvalidToken:
            raise ValidationError('Refresh token is invalid or expired.')


class PriceSerializer(serializers.ModelSerializer):
    """Serializer for price model"""
    id = serializers.CharField(required=False)

    class Meta:
        model = Price
        fields = (
            'id', 'unit_amount', 'currency', 'active', 'created',
            'lookup_key', 'description', 'contract_length',
            'trial_period_days', 'renews'
        )


class LeanPriceListSerializer(serializers.ModelSerializer):
    """Serializer for price model"""
    id = serializers.CharField(required=False)

    class Meta:
        model = Price
        fields = ('id', 'trial_period_days')

    def validate_trial_period_days(self, value):
        if value > 30:
            raise serializers.ValidationError(
                'Trial period cannot be longer than 30 days.'
            )
        return value


class CreateSubscriptionSerializer(serializers.Serializer):
    price_id = serializers.CharField()
    trial_period_days = serializers.IntegerField()

    def validate_trial_period_days(self, value):
        if value > 30:
            raise serializers.ValidationError(
                'Trial period cannot be longer than 30 days.'
            )
        return value

    def create_stripe_subscription(self):
        """Create and return a new stripe subscription."""
        validated_data = self.validated_data
        customer_id = self.context['request'].COOKIES['customer_id']

        stripe_subscription = self.susbcription_create_api(
            customer_id,
            validated_data['price_id'],
            validated_data['trial_period_days']
        )

        return stripe_subscription

    def susbcription_create_api(
            self, customer_id, price_id, trial_period_days, **kwargs):

        default_args = {
            'payment_behavior': 'default_incomplete',
            'payment_settings': {
                'save_default_payment_method': 'on_subscription'
            },
            'expand': ['pending_setup_intent'],
            'proration_behavior': 'none',
            # 'automatic_tax': {"enabled": True},
            # deactivated for now, reactivate in production
        }
        default_args.update(kwargs)

        stripe_subscription = stripe.Subscription.create(
            customer=customer_id,
            trial_period_days=trial_period_days,
            items=[{'price': price_id}],
            **default_args
        )
        return stripe_subscription
