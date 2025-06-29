import logging

import plaid
from plaid.model.item_public_token_exchange_request import \
    ItemPublicTokenExchangeRequest
from rest_framework import serializers
from django.conf import settings
from django.db import transaction

from core.clients import create_plaid_client
from financials.models import PlaidItem
from financials.models import Account, UserAccount
from financials.serializers.account import InstitutionSerializer

PLAID_COUNTRY_CODES = settings.PLAID_COUNTRY_CODES
plaid_client = create_plaid_client()
logger = logging.getLogger('ledget')


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        extra_kwargs = {'id': {'validators': []}}


class ExchangePlaidTokenSerializer(serializers.Serializer):
    institution = InstitutionSerializer(write_only=True)
    accounts = AccountSerializer(many=True, write_only=True)
    public_token = serializers.CharField(write_only=True)
    id = serializers.CharField(read_only=True)

    def create(self, validated_data):

        try:
            plaid_item = self._add_objects(validated_data)
        except plaid.ApiException as e:  # pragma: no cover
            logger.error(f"Plaid error: {e}")
            raise serializers.ValidationError(
                {"plaid": "Plaid error: {e}"}
            )
        except Exception as e:  # pragma: no cover
            logger.error(f"Error: {e}")
            raise serializers.ValidationError()

        return plaid_item

    @transaction.atomic
    def _add_objects(self, validated_data):
        institution_serializer = InstitutionSerializer()
        institution_serializer.create(validated_data['institution'])

        plaid_item = self._update_or_create_plaid_item(validated_data)
        self._update_or_create_accounts(plaid_item, validated_data)

        return plaid_item

    def _update_or_create_plaid_item(self, validated_data):

        exchange_request = ItemPublicTokenExchangeRequest(
            validated_data['public_token'])
        response = plaid_client.item_public_token_exchange(exchange_request)

        # Create plaid item
        plaid_item, _ = PlaidItem.objects.update_or_create(
            institution_id=validated_data['institution']['id'],
            user_id=self.context['request'].user.id,
            id=response['item_id'],
            defaults={
                'access_token': response['access_token'],
                'login_required': False
            }
        )

        return plaid_item

    def _update_or_create_accounts(self, plaid_item, validated_data):
        accounts_data = validated_data['accounts']
        institution_id = validated_data['institution']['id']
        new_accounts = [
            Account(
                plaid_item=plaid_item,
                institution_id=institution_id,
                **account
            )
            for account in accounts_data
        ]
        Account.objects.bulk_create(
            new_accounts,
            ignore_conflicts=True,
            unique_fields=['id'])

        bulkconnect = [
            UserAccount(user=self.context['request'].user, account=account)
            for account in new_accounts
        ]
        UserAccount.objects.bulk_create(
            bulkconnect,
            ignore_conflicts=True,
            unique_fields=['user', 'account'])


class PlaidItemsSerializer(serializers.ModelSerializer):
    accounts = AccountSerializer(many=True, read_only=True)
    institution = InstitutionSerializer(read_only=True)

    class Meta:
        model = PlaidItem
        exclude = ('access_token',)
