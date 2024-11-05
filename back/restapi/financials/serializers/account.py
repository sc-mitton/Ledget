import base64
from itertools import groupby
from datetime import datetime

from rest_framework import serializers

from financials.models import (
    Account,
    Institution,
    UserAccount,
    Transaction
)


class CustomBase64LogoField(serializers.Field):
    def to_representation(self, value):
        if value and value.path:
            try:
                with open(value.path, "rb") as f:
                    return base64.b64encode(f.read()).decode("utf-8")
            except Exception:
                return None
        else:
            return None


class InstitutionSerializer(serializers.ModelSerializer):
    logo = CustomBase64LogoField(required=False, read_only=True)
    id = serializers.CharField()

    class Meta:
        model = Institution
        fields = '__all__'


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
            self.child.Meta.model.objects.bulk_update(updated, updated_keys.keys())

        return updated


class AccountSerializer(serializers.ModelSerializer):
    institution = InstitutionSerializer(required=False, read_only=True)
    cardHue = serializers.SerializerMethodField(required=False, read_only=True)

    class Meta:
        model = Account
        exclude = ('plaid_item',)
        list_serializer_class = AccountLS

    def get_cardHue(self, obj):
        return getattr(obj, 'cardHue', None)

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
    unofficial_currency_code = serializers.CharField(required=False, allow_null=True)
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
                detail_totals[detail_total['detail']] = detail_total['total']

            final.append(detail_totals)

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

        repr['detail'] = Transaction.Detail(repr['detail']).label

        return repr
