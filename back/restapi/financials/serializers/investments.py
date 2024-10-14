from itertools import groupby

from rest_framework import serializers
from financials.models import AccountBalance


class SecuritySerializer(serializers.Serializer):
    name = serializers.CharField(required=False, allow_null=True)
    ticker_symbol = serializers.CharField(required=False, allow_null=True)
    security_id = serializers.CharField()


class HoldingSerializer(serializers.Serializer):
    cost_basis = serializers.FloatField(required=False)
    institution_price = serializers.FloatField(required=False)
    institution_value = serializers.FloatField(required=False)
    quantity = serializers.FloatField(required=False)
    vested_quantity = serializers.FloatField(required=False, allow_null=True)
    vested_value = serializers.FloatField(required=False, allow_null=True)
    security_id = serializers.CharField(required=False)


class InvestmentsTransactionSerializer(serializers.Serializer):
    amount = serializers.FloatField(required=False)
    price = serializers.FloatField(required=False)
    quantity = serializers.FloatField(required=False)
    type = serializers.CharField(required=False)
    subtype = serializers.CharField(required=False)
    date = serializers.DateField(required=False)
    fees = serializers.FloatField(required=False)
    name = serializers.CharField(required=False, allow_null=True)
    security_id = serializers.CharField(required=False)


class InvestmentsSerializer(serializers.Serializer):
    account_id = serializers.CharField()
    product_not_supported = serializers.BooleanField(required=False)
    holdings = HoldingSerializer(many=True, required=False)
    transactions = InvestmentsTransactionSerializer(many=True, required=False)
    securities = SecuritySerializer(many=True, required=False)
    balance = serializers.FloatField(required=False)

    def to_representation(self, instance):
        repr = super().to_representation(instance)
        if 'product_not_supported' in repr:
            return repr

        transactions = repr.pop('transactions')
        holdings = repr.pop('holdings')
        securities = repr.pop('securities')
        securities_dict = {
            security['security_id']: security
            for security in securities
        }

        repr['transactions'] = [
            {
                **transaction,
                'security': securities_dict[transaction['security_id']]
            }
            for transaction in transactions
        ]
        repr['holdings'] = [
            {
                **holding,
                'security': securities_dict[holding['security_id']]
            }
            for holding in holdings
        ]

        return repr


class InvestmenetBalanceListSerializer(serializers.ListSerializer):

    def to_representation(self, instance):
        repr = super().to_representation(instance)

        grouped = groupby(repr, lambda x: x['account'])
        final = []
        for account_id, balances in grouped:
            balances = list(balances)
            balances = [
                {
                    'date': b['date'],
                    'value': b['value']
                }
                for b in balances
            ] if len(balances) > 7 else []

            final.append({
                'account_id': account_id,
                'balances': balances
            })

        return final


class InvestmentBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountBalance
        fields = '__all__'
        list_serializer_class = InvestmenetBalanceListSerializer
