import hashlib
import logging

from rest_framework import serializers
from django.conf import settings
import stripe

from core.utils.stripe import stripe_error_handler, StripeError
from core.models import User, Device

stripe.api_key = settings.STRIPE_API_KEY
stripe_logger = logging.getLogger('stripe')


class NewSubscriptionSerializer(serializers.Serializer):
    price_id = serializers.CharField()
    trial_period_days = serializers.IntegerField(required=False)
    billing_cycle_anchor = serializers.IntegerField(required=False)

    def validate_trial_period_days(self, value):
        if value > 30:
            raise serializers.ValidationError(
                'Trial period cannot be longer than 30 days.'
            )
        return value


class UserSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField(read_only=True)
    name = serializers.SerializerMethodField(read_only=True)
    is_customer = serializers.SerializerMethodField(read_only=True)
    is_verified = serializers.SerializerMethodField(read_only=True)
    subscription = serializers.SerializerMethodField(read_only=True)
    service_provisioned_until = serializers.SerializerMethodField(
        read_only=True)
    authentication_level = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        exclude = ('is_active',)
        kwargs = {'account_flag': {'read_only': True}}

    def get_email(self, obj):
        return obj.traits.get('email', '')

    def get_is_customer(self, obj):
        return obj.is_customer

    def get_name(self, obj):
        return obj.traits.get('name', {})

    def get_is_verified(self, obj):
        return obj.is_verified

    def get_service_provisioned_until(self, obj):
        return obj.service_provisioned_until

    def get_authentication_level(self, obj):
        return obj.authentication_level

    def get_subscription(self, obj):
        # If patch method, return early to avoid Stripe API call
        if self.context['request'].method != 'GET':
            return None

        try:
            sub = self.get_stripe_subscription(obj.customer.id)
        except StripeError as e:
            stripe_logger.error(e)
            raise serializers.ValidationError(
                'Error retrieving subscription data.'
            )

        return {
            'id': sub.id,
            'status': sub.status,
            'current_period_end': sub.current_period_end,
            'cancel_at_period_end': sub.cancel_at_period_end,
            'plan': {
                'id': sub.plan.id,
                'amount': sub.plan.amount,
                'nickname': sub.plan.nickname,
                'interval': sub.plan.interval,
            }
        }

    @stripe_error_handler
    def get_stripe_subscription(self, customer_id):
        subs = stripe.Subscription.list(customer=customer_id)
        sub = next((s for s in subs if s.status == 'active'), None) or subs.data[0] # noqa

        return sub


class PaymentMethodSerializer(serializers.Serializer):
    payment_method_id = serializers.CharField(required=False)
    old_payment_method_id = serializers.CharField(required=False)


class SubscriptionItemsSerializer(serializers.Serializer):
    price = serializers.CharField()


class SubscriptionUpdateSerializer(serializers.Serializer):
    feedback = serializers.CharField(required=False)
    cancelation_reason = serializers.CharField(required=False)
    cancel_at_period_end = serializers.BooleanField(required=False)


class DeviceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Device
        exclude = ('user', 'token', )

    def create(self, validated_data):
        user = self.context['request'].user.id

        try:
            kwargs = {
                'user_id': user.id,
                'id': user.session_devices[0]['id'],
                'user_agent': user.session_devices[0]['user_agent'],
                'location': user.session_devices[0]['location'],
            }
        except KeyError:
            raise serializers.ValidationError('Missing device information.')

        # create sha256 hash of totp, user_agent, user, and location
        hash_value = hashlib.sha256((
            kwargs.values(),
            settings.SECRET_KEY
        ).encode('utf-8')).hexdigest()

        return Device.objects.create(
            hash=hash_value,
            **kwargs
        )
