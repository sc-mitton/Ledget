
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
import stripe

from core.models import (
    Customer,
    Price,
    Subscription
)


stripe.api_key = settings.STRIPE_API_KEY


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for customer model"""

    class Meta:
        model = Customer
        fields = ['city', 'state', 'postal_code',
                  'first_name', 'last_name']

    def validate(self, data):
        """Validate the data before creating the customer."""
        if self.context['request'].user.is_customer:
            raise serializers.ValidationError(
                'User is already a customer.'
            )
        return data

    def create_customer(self):
        """Create a new customer in stripe and in the db."""

        stripe_customer = self.create_stripe_customer()
        self.create_db_customer(stripe_customer)
        return stripe_customer

    def create_stripe_customer(self):
        """Create and return a new stripe customer."""
        validated_data = self.validated_data
        user = self.context['request'].user
        name = validated_data['first_name'] + ' ' + validated_data['last_name']

        address_items = ['city', 'state', 'postal_code']
        address = {item: validated_data[item] for item in address_items}
        address['country'] = 'US'  # hardcode country for now

        customer = stripe.Customer.create(
            email=user.email,
            name=name,
            address=address,
        )
        return customer

    def create_db_customer(self, stripe_cust):
        user = self.context['request'].user
        args = {
            'user': user,
            'id': stripe_cust.id,
            'first_name': stripe_cust.name.split(' ')[0],
            'last_name': stripe_cust.name.split(' ')[1],
            'city': stripe_cust.address.city,
            'state': stripe_cust.address.state,
            'postal_code': stripe_cust.address.postal_code,
            'country': stripe_cust.address.country,
            'created': stripe_cust.created,
        }
        customer = Customer.objects.create(**args)
        customer.save()


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


class CreateSubscriptionSerializer(serializers.Serializer):
    price_id = serializers.CharField()
    trial_period_days = serializers.IntegerField()

    def validate(self, data):
        if not self.context['request'].user.is_customer:
            raise serializers.ValidationError(
                'Only customers can create subscriptions.'
            )
        if self.context['request'].user.customer.subscription:
            raise serializers.ValidationError(
                'User already has an ongoing subscription.'
            )

        price = Price.objects.filter(id=data['price_id']).first()
        if not price:
            raise serializers.ValidationError(
                'Invalid price id.'
            )
        if not price.active:
            raise serializers.ValidationError(
                'Price is not active.'
            )
        if price.trial_period_days != data['trial_period_days']:
            raise serializers.ValidationError(
                'Invalid trial period.'
            )

        return data

    def create_subscription(self):
        """Create and return a new stripe subscription
        and a new subscription object in the database."""

        stripe_susbcription = self.create_stripe_subscription()
        self.create_db_subscription(stripe_susbcription)
        return stripe_susbcription

    def create_db_subscription(self, stripe_sub):
        args = {
            'id': stripe_sub.id,
            'customer_id': stripe_sub.customer,
            'price_id': stripe_sub['items']['data'][0]['price']['id'],
            'current_period_end': stripe_sub.current_period_end,
            'status': stripe_sub.status,
            'cancel_at_period_end': stripe_sub.cancel_at_period_end,
            'default_payment_method': stripe_sub.default_payment_method,
            'created': stripe_sub.created,
            'trial_start': stripe_sub.trial_start,
            'trial_end': stripe_sub.trial_end,
        }

        object = Subscription.objects.create(**args)
        object.save()

    def create_stripe_subscription(self):
        """Create and return a new stripe subscription."""
        validated_data = self.validated_data
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

        customer_id = self.context['request'].user.customer.id
        trial_period_days = validated_data['trial_period_days']
        price_id = validated_data['price_id']

        stripe_subscription = stripe.Subscription.create(
            customer=customer_id,
            trial_period_days=trial_period_days,
            items=[{'price': price_id}],
            **default_args
        )

        return stripe_subscription
