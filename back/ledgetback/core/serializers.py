from rest_framework import serializers
from django.conf import settings
import stripe

from core.models import User

stripe.api_key = settings.STRIPE_API_KEY


class SubscriptionSerializer(serializers.Serializer):
    price_id = serializers.CharField()
    trial_period_days = serializers.IntegerField(required=False)
    billing_cycle_anchor = serializers.IntegerField(required=False)

    def validate_trial_period_days(self, value):
        if value > 30:
            raise serializers.ValidationError(
                'Trial period cannot be longer than 30 days.'
            )
        return value


class OnboardUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('is_onboarded',)


class PaymentMethodSerializer(serializers.Serializer):
    payment_method_id = serializers.CharField(required=False)
    old_payment_method_id = serializers.CharField(required=False)


class SubscriptionUpdateSerializer(serializers.Serializer):
    feedback = serializers.CharField(required=False)
    cancelation_reason = serializers.CharField(required=False)
