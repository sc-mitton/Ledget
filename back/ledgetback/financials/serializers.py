import base64
import logging

from rest_framework import serializers
from plaid.model.item_public_token_exchange_request import \
    ItemPublicTokenExchangeRequest
from plaid.model.institutions_get_by_id_request import \
    InstitutionsGetByIdRequest
from plaid.model.country_code import CountryCode
from django.conf import settings
from django.core.files.base import ContentFile
from drf_extra_fields.fields import Base64ImageField
import plaid

from core.clients import plaid_client
from financials.models import PlaidItem
from financials.models import Account, Institution

PLAID_COUNTRY_CODES = settings.PLAID_COUNTRY_CODES

logger = logging.getLogger('ledget')


class InstitutionSerializer(serializers.ModelSerializer):
    logo = Base64ImageField(required=False, read_only=True)
    id = serializers.CharField()

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

        accounts_data = validated_data.pop('accounts', [])
        institution_data = validated_data.pop('institution', {})

        try:
            plaid_item = self.create_objects(
                validated_data, institution_data, accounts_data
            )
            return plaid_item
        except plaid.ApiException as e:
            logger.error(f"Plaid error: {e}")
            raise serializers.ValidationError(
                {"plaid": "Plaid error: {e}"}
            )
        except Exception as e:
            logger.error(f"Error: {e}")
            raise serializers.ValidationError(
                detail={"error": f"Error: {e}"}
            )

    def create_objects(self, validated_data, institution_data, accounts_data):

        exchange_request = ItemPublicTokenExchangeRequest(**validated_data)
        response = plaid_client.item_public_token_exchange(exchange_request)

        institution, created = Institution.objects.get_or_create(
            id=institution_data['id'],
            defaults=institution_data
        )

        # Add optional metadata to institution
        if created:
            self.add_institution_optional_metadata(institution)

        # Create plaid item
        plaid_item = PlaidItem.objects.create(
            user=self.context['request'].user,
            institution=institution,
            id=response['item_id'],
            access_token=response['access_token']
        )

        # Create accounts
        new_accounts = [
            Account(plaid_item=plaid_item, institution=institution, **account)
            for account in accounts_data
        ]
        Account.objects.bulk_create(new_accounts)

        return plaid_item

    def add_institution_optional_metadata(self, institution):

        response = self.get_plaid_institution_data(institution.id)
        data = response['institution']

        institution.primary_color = data.get('primary_color')
        institution.url = data.get('url')
        institution.oath_url = data.get('oath')

        if data.get('logo'):
            file_name = f"logo_{institution.id}.png"
            image_file = ContentFile(base64.b64decode(data['logo']), file_name)
            institution.logo.save(file_name, image_file, save=True)

    def get_plaid_institution_data(self, institution_id):

        institution_request = InstitutionsGetByIdRequest(
            institution_id=institution_id,
            country_codes=list(
                map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)
            ),
            options={'include_optional_metadata': True}
        )

        response = plaid_client.institutions_get_by_id(institution_request)
        return response.to_dict()


class PlaidItemsSerializer(serializers.ModelSerializer):
    accounts = AccountSerializer(many=True, read_only=True)
    institution = InstitutionSerializer(read_only=True)

    class Meta:
        model = PlaidItem
        exclude = ('access_token', 'user')
