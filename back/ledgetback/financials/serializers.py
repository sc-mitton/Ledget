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
import plaid

from core.clients import plaid_client
from financials.models import PlaidItem
from financials.models import Account, Institution

PLAID_COUNTRY_CODES = settings.PLAID_COUNTRY_CODES

logger = logging.getLogger('ledget')


class CustomBase64ImageField(serializers.Field):
    def to_representation(self, value):
        with open(value.path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")


class InstitutionSerializer(serializers.ModelSerializer):
    logo = CustomBase64ImageField(required=False, read_only=True)
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
            institution = self.update_or_create_institution(institution_data)
            plaid_item = self.create_plaid_item(institution, validated_data)
            self.create_accounts(institution, plaid_item, accounts_data)
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

    def update_or_create_institution(self, institution_data):
        resonse = self.get_plaid_institution(institution_data['id'])
        data = resonse.to_dict()['institution']

        logo = data.pop('logo', None)
        decoded_logo = base64.b64decode(logo)
        filename = f"logo_{institution_data['id']}.png"
        image_file = ContentFile(decoded_logo, name=filename)

        institution = Institution.objects.update_or_create(
            defaults={
                'logo': image_file,
                'url': data.get('url'),
                'oath': data.get('oath'),
                'primary_color': data.get('primary_color'),
                'name': institution_data['name']
            },
            id=institution_data['id']
        )[0]

        return institution

    def create_plaid_item(self, institution, validated_data):

        exchange_request = ItemPublicTokenExchangeRequest(**validated_data)
        response = plaid_client.item_public_token_exchange(exchange_request)

        # Create plaid item
        plaid_item = PlaidItem.objects.create(
            institution_id=institution.id,
            user_id=self.context['request'].user.id,
            id=response['item_id'],
            access_token=response['access_token']
        )

        return plaid_item

    def create_accounts(self, institution, plaid_item, accounts_data):

        new_accounts = [
            Account(plaid_item=plaid_item, institution=institution, **account)
            for account in accounts_data
        ]
        Account.objects.bulk_create(new_accounts)

    def get_plaid_institution(self, institution_id):

        institution_request = InstitutionsGetByIdRequest(
            institution_id=institution_id,
            country_codes=list(
                map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)
            ),
            options={'include_optional_metadata': True}
        )

        response = plaid_client.institutions_get_by_id(institution_request)
        return response


class PlaidItemsSerializer(serializers.ModelSerializer):
    accounts = AccountSerializer(many=True, read_only=True)
    institution = InstitutionSerializer(read_only=True)

    class Meta:
        model = PlaidItem
        exclude = ('access_token', 'user')
