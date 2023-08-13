
from rest_framework import serializers
from plaid.model.item_public_token_exchange_request import \
    ItemPublicTokenExchangeRequest

from core.clients import plaid_client
from financials.models import PlaidItem
from financials.models import Account, Institution


class InstitutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Institution
        fields = '__all__'


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        exclude = ('plaid_item', 'institution')


class ExchangePlaidTokenSerializer(serializers.Serializer):
    accounts = AccountSerializer(many=True, write_only=True)
    institution = InstitutionSerializer(write_only=True)
    public_token = serializers.CharField(write_only=True)

    def create(self, validated_data):

        accounts = validated_data.pop('accounts', [])
        institution_data = validated_data.pop('institution', {})
        exchange_request = ItemPublicTokenExchangeRequest(**validated_data)
        response = plaid_client.item_public_token_exchange(exchange_request)

        institution = Institution.objects.get_or_create(**institution_data)[0]
        plaid_item = PlaidItem.objects.create(
            user=self.context['request'].user,
            institution=institution,
            id=response['item_id'],
            access_token=response['access_token']
        )

        for account in accounts:
            Account.objects.create(
                plaid_item=plaid_item,
                institution=institution,
                **account
            )

        return plaid_item


class PlaidItemsSerializer(serializers.ModelSerializer):
    accounts = AccountSerializer(many=True, read_only=True)
    institution = InstitutionSerializer(read_only=True)

    class Meta:
        model = PlaidItem
        exclude = ('access_token', 'user')
