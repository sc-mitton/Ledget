from rest_framework import serializers
from financials.models import Transaction
from budget.serializers import CategorySerializer, BillSerializer


class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    bill = BillSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'
