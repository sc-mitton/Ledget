from rest_framework import serializers

from financials.models import Transaction
from budget.serializers import CategorySerializer, BillSerializer
from budget.models import Category, Bill


class TransactionListSerializer(serializers.ListSerializer):

    def update(self, instance, validated_data):

        category_ids = []
        bill_ids = []
        for item in validated_data:
            category_id = item.pop('category', None)
            bill_id = item.pop('bill', None)

            category_ids.append(category_id if category_id else None)
            bill_ids.append(bill_id if bill_id else None)

        try:
            categories = Category.objects.filter(
                id__in=[id for id in category_ids if id is not None]
            )
            bills = Bill.objects.filter(
                id__in=[id for id in bill_ids if id is not None])
        except (Category.DoesNotExist, Bill.DoesNotExist):
            raise serializers.ValidationError(
                'One or more of the categories or bills does not exist.'
            )

        category_index = 0  # index on the category queryset
        bill_index = 0  # index on the bill queryset
        updated = []
        for i in range(0, len(instance)):
            transaction = instance[i]
            if category_ids[i]:
                transaction.category = categories[category_index]
                category_index += 1
            if bill_ids[i]:
                transaction.bill = bills[bill_index]
                bill_index += 1

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
