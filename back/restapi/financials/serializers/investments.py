from rest_framework import serializers


class SecuritySerializer(serializers.Serializer):
    name = serializers.CharField()
    ticker_symbol = serializers.CharField()
    security_id = serializers.CharField()


class HoldingSerializer(serializers.Serializer):
    cost_basis = serializers.FloatField()
    institution_price = serializers.FloatField()
    institution_value = serializers.FloatField()
    quantity = serializers.FloatField()
    vested_quantity = serializers.FloatField()
    vested_value = serializers.FloatField()
    security_id = serializers.CharField()


class InvestmentsTransactionSerializer(serializers.Serializer):
    amount = serializers.FloatField()
    price = serializers.FloatField()
    quantity = serializers.FloatField()
    type = serializers.CharField()
    subtype = serializers.CharField()
    date = serializers.DateField()
    fees = serializers.FloatField()
    name = serializers.CharField()
    security_id = serializers.CharField()


class InvestmentsSerializer(serializers.Serializer):
    account_id = serializers.IntegerField()
    holdings = HoldingSerializer(many=True)
    transactions = InvestmentsTransactionSerializer(many=True)
    securities = SecuritySerializer(many=True)
    balance = serializers.FloatField()

    def to_representation(self, instance):
        repr = super().to_representation(instance)

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
