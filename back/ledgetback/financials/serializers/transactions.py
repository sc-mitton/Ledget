from rest_framework import serializers
from financials.models import Transaction
from budget.serializers import CategorySerializer, BillSerializer
from budget.models import Category, Bill


class TransactionListSerializer(serializers.ListSerializer):

    def update(self, instances, validated_data):

        category_ids = []
        bill_ids = []
        for item in validated_data:
            category = item.pop('category', None)
            bill = item.pop('bill', None)

            if category:
                category_ids.append(category.get('id', None))
            else:
                category_ids.append(None)

            if bill:
                bill_ids.append(bill.get('id', None))
            else:
                bill_ids.append(None)

        categories = Category.objects.filter(
            id__in=[id for id in category_ids if id is not None]
        )
        bills = Bill.objects.filter(id__in=[id for id in bill_ids if id is not None])

        category_index = 0  # index on the category queryset
        bill_index = 0  # index on the bill queryset
        updated = []
        for i in range(0, len(instances)):
            instance = instances[i]
            if category_ids[i]:
                instance.category = categories[category_index]
                category_index += 1
            if bill_ids[i]:
                instance.bill = bills[bill_index]
                bill_index += 1

            for field in self.Meta.fields:
                setattr(
                    instance,
                    field,
                    validated_data[i].get(field, getattr(instance, field))
                )

            updated.append(instance)

        self.Meta.model.objects.bulk_update(
            updated,
            fields=['category', 'bill', 'category_confirmed', 'bill_confirmed']
        )

        return updated


class UpdateTransactionsSerializer(serializers.ModelSerializer):
    category = CategorySerializer(required=False)
    bill = BillSerializer(required=False)

    class Meta:
        model = Transaction
        fields = Transaction.rest_api_editable_fields
        extra_kwargs = {
            field: {'required': False} for field in Transaction.rest_api_editable_fields
        }
        list_serializer_class = TransactionListSerializer


class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    bill = BillSerializer()

    class Meta:
        model = Transaction
        fields = '__all__'
