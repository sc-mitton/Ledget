from itertools import groupby
from datetime import datetime
from decimal import Decimal
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from plaid.model.country_code import CountryCode
from rest_framework import serializers
from django.conf import settings
import logging

from core.clients import create_plaid_client
from financials.models import (
    Account,
    Institution,
    UserAccount,
    Transaction
)

PLAID_COUNTRY_CODES = settings.PLAID_COUNTRY_CODES
plaid_client = create_plaid_client()
logger = logging.getLogger('ledget')


class InstitutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Institution
        fields = '__all__'

        extra_kwargs = {'id': {'validators': []}, 'name': {'required': False}}

    def create(self, validated_data):
        institution, created = Institution.objects.get_or_create(
            id=validated_data['id'])

        if not created:
            return institution

        try:
            response = self._get_plaid_institution(validated_data['id'])
            data = response.to_dict()['institution']
        except Exception as e:
            logger.error(f"Error: {e}")
            raise serializers.ValidationError()

        institution.logo = data.get('logo')
        institution.url = data.get('url')
        institution.oath = data.get('oath')
        institution.primary_color = data.get('primary_color')
        institution.name = data.get('name')

        return institution

    def _get_plaid_institution(self, institution_id):

        institution_request = InstitutionsGetByIdRequest(
            institution_id=institution_id,
            country_codes=list(
                map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)
            ),
            options={'include_optional_metadata': True}
        )

        response = plaid_client.institutions_get_by_id(institution_request)
        return response


class AccountLS(serializers.ListSerializer):

    def update(self, instance, validated_data):
        instance_mapping = {i.account_id: i for i in instance}
        data_mapping = {data['account'].id: data for data in validated_data}

        updated = []
        updated_keys = {}
        for account_id, data in data_mapping.items():
            inst = instance_mapping.get(account_id, None)
            if inst:
                for attr, value in data.items():
                    if hasattr(inst, attr):
                        updated_keys[attr] = True
                        setattr(inst, attr, value)
                updated.append(inst)

        if updated:
            self.child.Meta.model.objects.bulk_update(
                updated, updated_keys.keys())

        return updated


class AccountSerializer(serializers.ModelSerializer):
    institution = InstitutionSerializer(required=False, read_only=True)
    card_hue = serializers.SerializerMethodField(
        required=False, read_only=True)
    pinned = serializers.SerializerMethodField(required=False, read_only=True)

    class Meta:
        model = Account
        exclude = ('plaid_item',)
        list_serializer_class = AccountLS

    def get_card_hue(self, obj):
        return getattr(obj, 'card_hue', None)

    def get_pinned(self, obj):
        return getattr(obj, 'pinned', None)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['institution_id'] = rep.pop('institution', None)
        return rep


class BalanceSerializer(serializers.Serializer):
    available = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        required=False,
        allow_null=True)
    current = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        required=False,
        allow_null=True)
    limit = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        required=False,
        allow_null=True)

    def validate(self, data):
        # Round everything to 2 decimal places
        for key in data:
            data[key] = round(data[key], 2) if data[key] else None

        return data


class PlaidBalanceSerializer(serializers.Serializer):
    iso_currency_code = serializers.CharField(required=False, allow_null=True)
    unofficial_currency_code = serializers.CharField(
        required=False, allow_null=True)
    official_name = serializers.CharField(required=False, allow_null=True)
    balances = BalanceSerializer()
    account_id = serializers.CharField()
    type = serializers.CharField()
    subtype = serializers.CharField()


class UserAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserAccount
        exclude = ('user',)
        list_serializer_class = AccountLS


class BreakdownHistoryListSerializer(serializers.ListSerializer):

    def to_representation(self, data):
        repr = super().to_representation(data)
        grouped = groupby(repr, key=lambda x: x['date'])

        final = []
        for date, group in grouped:
            detail_totals_list = list(group)
            detail_totals = {'date': date}

            for detail_total in detail_totals_list:
                detail_totals[detail_total['detail']
                              ] = Decimal(detail_total['total'])
            for choice in Transaction.Detail.choices:
                if choice[1] not in detail_totals:
                    detail_totals[str(choice[1])] = 0

            final.append(detail_totals)

        final = sorted(final, key=lambda x: x['date'])

        return final


class BreakdownHistorySerializer(serializers.ModelSerializer):
    month = serializers.DateField()
    year = serializers.DateField()
    total = serializers.DecimalField(max_digits=30, decimal_places=4)

    class Meta:
        model = Transaction
        list_serializer_class = BreakdownHistoryListSerializer
        fields = ('detail', 'total', 'month', 'year', )

    def to_representation(self, instance):
        repr = super().to_representation(instance)
        month_date = datetime.strptime(repr['month'], '%Y-%m-%d')
        year_date = datetime.strptime(repr['year'], '%Y-%m-%d')

        repr['date'] = datetime(
            year_date.year, month_date.month, 1).strftime('%Y-%m-%d')

        repr['detail'] = str(Transaction.Detail(repr['detail']).label)

        return repr
