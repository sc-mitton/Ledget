from datetime import datetime
from rest_framework import serializers
from decimal import Decimal

from financials.models import Transaction


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = ('transaction_id', 'date', 'amount', 'name',)


class RecurringTransactionListSerializer(serializers.ListSerializer):

    def to_representation(self, data):
        repr = super().to_representation(data)

        transaction_ids = []
        for transaction in repr:
            transaction_ids.extend(transaction['transaction_ids'])

        transactions = Transaction.objects.filter(transaction_id__in=transaction_ids)
        transactions = TransactionSerializer(transactions, many=True).data
        transactions = {
            str(transaction['transaction_id']): transaction
            for transaction in transactions
        }

        for transaction in repr:
            transaction_ids = transaction.pop('transaction_ids')
            transaction['transactions'] = [
                transactions.get(transaction_id, None)
                for transaction_id in transaction_ids
                if transactions.get(transaction_id, None)
            ]

        return repr


class RecurringTransaction(serializers.Serializer):
    transaction_ids = serializers.ListField(child=serializers.CharField())
    frequency = serializers.ChoiceField(choices=[
        'WEEKLY', 'BIWEEKLY', 'SEMI_MONTHLY', 'MONTHLY', 'ANNUALLY', 'UNKNOWN'])
    last_date = serializers.DateField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        list_serializer_class = RecurringTransactionListSerializer

    def to_internal_value(self, data):
        amount = data.get('average_amount', {}).get('amount', None)
        data['amount'] = Decimal(amount) if amount else None
        # Trim to 2 decimal places
        data['amount'] = data['amount'].quantize(Decimal('.01'))
        value = super().to_internal_value(data)
        return value

    def to_representation(self, instance):
        repr = super().to_representation(instance)

        repr['upper_amount'] = repr.pop('amount')

        date = datetime.strptime(repr.pop('last_date'), '%Y-%m-%d') \
            if repr.get('last_date', None) else None
        frequency = repr.pop('frequency', None)
        if frequency == 'MONTHLY':
            repr['day'] = date.day if date else None
            repr['period'] = 'month'
        elif frequency == 'ANNUALLY':
            repr['day'] = date.day if date else None
            repr['month'] = date.month if date else None
            repr['period'] = 'year'

        return repr
