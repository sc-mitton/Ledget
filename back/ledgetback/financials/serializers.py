import base64
import logging
from PIL import Image

from rest_framework import serializers
from plaid.model.item_public_token_exchange_request import \
    ItemPublicTokenExchangeRequest
from plaid.model.institutions_get_by_id_request import \
    InstitutionsGetByIdRequest
from plaid.model.country_code import CountryCode
from django.conf import settings
from drf_extra_fields.fields import Base64ImageField

from core.clients import plaid_client
from financials.models import PlaidItem
from financials.models import Account, Institution

PLAID_COUNTRY_CODES = settings.PLAID_COUNTRY_CODES

logger = logging.getLogger('ledget')


class InstitutionSerializer(serializers.ModelSerializer):
    logo = Base64ImageField(required=False, read_only=True)

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

        institution, created = Institution.objects.get_or_create(
            **institution_data
        )
        if created:
            self.add_institution_optional_metadata(institution)

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

    def add_institution_optional_metadata(self, institution):
        institution_request = InstitutionsGetByIdRequest(
            institution_id=institution.id,
            country_codes=list(
                map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)
            ),
            options={'include_optional_metadata': True}
        )
        response = plaid_client.institutions_get_by_id(institution_request)
        data = response.to_dict()['institution']

        if data.get('logo'):
            logo_binary = base64.b64decode(data['logo'])
            image = Image.open(logo_binary)
            institution.logo = image

        institution.primary_color = data.get('primary_color', None)
        institution.url = data.get('url', None)
        institution.oath_url = data.get('oath', None)
        institution.save()


class PlaidItemsSerializer(serializers.ModelSerializer):
    accounts = AccountSerializer(many=True, read_only=True)
    institution = InstitutionSerializer(read_only=True)

    class Meta:
        model = PlaidItem
        exclude = ('access_token', 'user')
