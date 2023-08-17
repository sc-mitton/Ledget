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

        try:
            self.update_or_create_institution(validated_data['institution'])
            plaid_item = self.create_plaid_item(validated_data)
            self.create_accounts(plaid_item, validated_data)
        except plaid.ApiException as e:
            logger.error(f"Plaid error: {e}")
            raise serializers.ValidationError(
                {"plaid": "Plaid error: {e}"}
            )
        except Exception as e:
            logger.error(f"Error: {e}")
            raise serializers.ValidationError()

        return plaid_item

    def update_or_create_institution(self, institution_data):
        institution, created = Institution.objects.get_or_create(
            id=institution_data['id']
        )
        if created:
            self.update_institution_metadata(institution)

    def update_institution_metadata(self, institution):
        resonse = self.get_plaid_institution(institution.id)
        data = resonse.to_dict()['institution']

        decoded_logo = base64.b64decode(data['logo'])
        filename = f"logo_{institution.id}.png"
        image_file = ContentFile(decoded_logo, name=filename)

        institution.logo = image_file
        institution.url = data.get('url')
        institution.oath = data.get('oath')
        institution.primary_color = data.get('primary_color')
        institution.name = data.get('name')
        institution.save()

    def create_plaid_item(self, validated_data):

        exchange_request = ItemPublicTokenExchangeRequest(
            validated_data['public_token']
        )
        response = plaid_client.item_public_token_exchange(exchange_request)

        # Create plaid item
        plaid_item = PlaidItem.objects.create(
            institution_id=validated_data['institution']['id'],
            user_id=self.context['request'].user.id,
            id=response['item_id'],
            access_token=response['access_token']
        )

        return plaid_item

    def create_accounts(self, plaid_item, validated_data):
        accounts_data = validated_data['accounts']
        institution_id = validated_data['institution']['id']
        print(accounts_data)
        new_accounts = [
            Account(
                plaid_item=plaid_item,
                institution_id=institution_id,
                **account
            )
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
