from rest_framework import serializers
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_API_KEY


class SubscriptionSerializer(serializers.Serializer):
    price_id = serializers.CharField()
    trial_period_days = serializers.IntegerField()

    def validate_trial_period_days(self, value):
        if value > 30:
            raise serializers.ValidationError(
                'Trial period cannot be longer than 30 days.'
            )
        return value
