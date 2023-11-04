from rest_framework import serializers

from financials.models import Transaction
from budget.serializers import CategorySerializer, BillSerializer
from budget.models import Category, Bill


class TransactionListSerializer(serializers.ListSerializer):

    def update(self, instance, validated_data):

        category_ids = []
        bill_ids = []
        for item in validated_data:
            category_id = item.get('category', None)
            bill_id = item.get('bill', None)

            if category_id:
                category_ids.append(category_id)
            elif bill_id:
                bill_ids.append(bill_id)

        categories = {}
        bills = {}
        try:
            categories_qset = Category.objects.filter(id__in=category_ids)
            bills_qset = Bill.objects.filter(id__in=bill_ids)
            categories = {str(cat.id): cat for cat in categories_qset}
            bills = {str(bill.id): bill for bill in bills_qset}
        except (Category.DoesNotExist, Bill.DoesNotExist):
            raise serializers.ValidationError(
                'One or more of the categories or bills does not exist.')

        updated = []
        for i in range(0, len(validated_data)):
            transaction = instance[i]
            category = validated_data[i].get('category', None)
            bill = validated_data[i].get('bill', None)
            if category and categories.get(category, None):
                transaction.category = categories[category]
                updated.append(transaction)
            elif bill and bills.get(bill, None):
                transaction.bill = bills[bill]
                updated.append(transaction)

        Transaction.objects.bulk_update(updated, ['category', 'bill'])
        return updated

    def save(self, **kwargs):
        self.update(self.instance, self.validated_data)


class UpdateTransactionsSerializer(serializers.Serializer):
    category = serializers.CharField(required=False)
    bill = serializers.CharField(required=False)
    transaction_id = serializers.CharField(required=True)

    class Meta:
        list_serializer_class = TransactionListSerializer


class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    bill = BillSerializer()
    predicted_category = CategorySerializer()
    predicted_bill = BillSerializer()

    class Meta:
        model = Transaction
        fields = '__all__'
