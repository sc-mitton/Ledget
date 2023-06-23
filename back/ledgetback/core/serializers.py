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

    def create_stripe_subscription(self):
        """Create and return a new stripe subscription."""
        validated_data = self.validated_data
        customer_id = self.context['request'].user.customer.id

        stripe_subscription = self.susbcription_create_api(
            customer_id,
            validated_data['price_id'],
            validated_data['trial_period_days']
        )

        return stripe_subscription

    def susbcription_create_api(
            self, customer_id, price_id, trial_period_days):

        args = {
            'payment_behavior': 'default_incomplete',
            'payment_settings': {
                'save_default_payment_method': 'on_subscription'
            },
            'expand': ['pending_setup_intent'],
            'proration_behavior': 'none',
            # 'automatic_tax': {"enabled": True},
            # deactivated for now, reactivate in production
        }
        if trial_period_days:
            args['trial_period_days'] = trial_period_days

        stripe_subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[{'price': price_id}],
            **args
        )
        return stripe_subscription
