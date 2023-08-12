from rest_framework import serializers
from django.conf import settings
from plaid.model.item_public_token_exchange_request import \
    ItemPublicTokenExchangeRequest
import stripe

from core.clients import plaid_client
from institutions.models import Account
from core.models import PlaidItem

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


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'


class ExchangePlaidTokenSerializer(serializers.ModelSerializer):
    accounts = AccountSerializer(many=True, write_only=True)
    public_token = serializers.CharField(write_only=True)

    class Meta:
        model = 'core.PlaidItem'
        fields = '__all__'

    def create(self, validated_data):

        accounts = validated_data.pop('accounts', [])

        exchange_request = ItemPublicTokenExchangeRequest(
            **validated_data
        )
        response = plaid_client.item_public_token_exchange(
            exchange_request
        )
        item = PlaidItem.objects.create(
            user=self.context['request'].user,
            id=response['item_id'],
            access_token=response['access_token']
        )

        for account in accounts:
            Account.objects.create(
                item=item,
                **account
            )

        return item
