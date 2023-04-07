
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from rest_framework_simplejwt.exceptions import InvalidToken
import stripe

from core.models import BillingInfo
from core.models import Customer

from datetime import datetime, timedelta


stripe.api_key = settings.STRIPE_SK


class TrialEnd:
    trial_end = datetime.now().replace(hour=0, minute=0, microsecond=0) \
            + timedelta(days=14)

    @classmethod
    def unix(cls):
        return int(cls.trial_end.timestamp())


class BillingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingInfo
        fields = ('id', 'user_id', 'city', 'state', 'postal_code')


class UserSerializer(serializers.ModelSerializer):
    billing_info = BillingInfoSerializer(required=False)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'first_name',
                  'last_name', 'billing_info')
        write_only_fields = ('password',)
        extra_kwargs = {'email': {'validators': []}}

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        billing_info_data = validated_data.pop('billing_info', None)
        if billing_info_data:
            billing_info, created = BillingInfo.objects.update_or_create(
                user=instance,
                defaults=billing_info_data
            )
            if created:
                billing_info.save()

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
        customer = getattr(user, 'customer', None)
        is_active = getattr(customer, 'is_active', False)

        token = super().get_token(user)
        token['user'] = {
            'id': str(user.id),
            'email': user.email,
            'full_name': user.full_name,
            'is_active': is_active,
        }

        return token


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken(
                "No valid token found in cookie 'token'")


class SubscriptionSerializer(serializers.Serializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['price_id'] = serializers.CharField(required=True)
        self.fields['trial_period_days'] = serializers.IntegerField(
            required=True
        )

    def create(self, validated_data):

        user = self.context['request'].user
        if not hasattr(user, 'customer'):
            self.create_customer(user)

        subscription = self.create_subscription(
            user,
            validated_data['price_id'],
            validated_data['trial_period_days']
        )
        return subscription

    def create_subscription(self, user, price_id, trial_period_days=0):
        subscription_paylod = self.build_subscription_payload(
            user.customer.customer_id,
            price_id,
            trial_period_days
        )
        subscription = stripe.Subscription.create(
            **subscription_paylod
        )
        user.customer.subscription_id = subscription.get('id')
        user.customer.save()
        return subscription

    def create_customer(self, user):
        """Create a Stripe customer in stripe and the database."""
        customer = stripe.Customer.create(
            email=user.email,
            name=user.full_name,
            address={
                "country": "US",
                "city": user.billing_info.city,
                "postal_code": user.billing_info.postal_code
            }
        )
        Customer.objects.create(
            user=user,
            customer_id=customer.get('id'),
        )
        return customer.id

    def build_subscription_payload(self, customer_id,
                                   price_id, trial_period_days=0):
        return {
            'customer': customer_id,
            'items': [{'price': price_id}],
            'payment_behavior': 'default_incomplete',
            'payment_settings': {
                'save_default_payment_method': 'on_subscription'
            },
            'expand': ['pending_setup_intent'],
            'trial_end': TrialEnd.unix(),
            'proration_behavior': 'none',
            # 'automatic_tax': {"enabled": True},
            # deactivated for now, reactivate in production
        }
