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

            if category_id:
                category_ids.append(category_id)
            else:
                category_ids.append(None)

            if bill_id:
                bill_ids.append(bill_id)
            else:
                bill_ids.append(None)

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
            instance = instance[i]
            if category_ids[i]:
                instance.category = categories[category_index]
                category_index += 1
            if bill_ids[i]:
                instance.bill = bills[bill_index]
                bill_index += 1

            updated.append(instance)

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
