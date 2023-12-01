from rest_framework import serializers

from financials.models import Transaction, Note
from budget.serializers import CategorySerializer, BillSerializer
from budget.models import Category, Bill, TransactionCategory


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        exclude = ('user', 'transaction')


class UpdateTransactionListSerializer(serializers.ListSerializer):

    def update(self, instances, validated_data):
        bill_ids = [item['bill'] for item in validated_data if item.get('bill', None)]
        category_ids = []
        for item in validated_data:
            if item.get('categories', False):
                category_ids.extend([cat['id'] for cat in item['categories']])

        bill_objs = self._get_bill_objects(bill_ids)
        category_objs = self._get_category_objects(category_ids)

        updated_transactions = []
        created_transaction_categories = []
        for i, data in enumerate(validated_data):
            bill_id = data.get('bill', False)
            category_data = data.get('categories', False)
            instance = instances[i]

            if bill_id:
                instance.bill = bill_objs[bill_id]
                updated_transactions.append(instance)
            elif category_data:
                for i, category in enumerate(category_data):
                    id = category['id']
                    fraction = category['fraction']
                    transaction_category = TransactionCategory(
                        transaction=instance,
                        category=category_objs[id],
                        fraction=fraction
                    )
                    created_transaction_categories.append(transaction_category)

        Transaction.objects.bulk_update(updated_transactions, ['bill'])
        TransactionCategory.objects.bulk_create(created_transaction_categories)

        return instances

    def _get_bill_objects(self, bill_ids):
        try:
            bills_qset = Bill.objects.filter(id__in=bill_ids)
            bills = {str(bill.id): bill for bill in bills_qset}
        except Bill.DoesNotExist:
            raise serializers.ValidationError(
                'One or more of the bills does not exist.')
        return bills

    def _get_category_objects(self, category_ids):
        try:
            categories_qset = Category.objects.filter(id__in=category_ids)
            categories = {str(cat.id): cat for cat in categories_qset}
        except Category.DoesNotExist:
            raise serializers.ValidationError(
                'One or more of the categories does not exist.')
        return categories

    def save(self, **kwargs):
        self.update(self.instance, self.validated_data)


class SimpleCategorySerializer(serializers.Serializer):
    id = serializers.CharField(required=True)
    fraction = serializers.DecimalField(
        required=True,
        max_digits=3,
        max_value=1,
        decimal_places=2,
        min_value=0)

    def to_representation(self, instance):
        return {'id': instance.id, 'name': instance.name}


class UpdateTransactionsSerializer(serializers.Serializer):
    categories = SimpleCategorySerializer(many=True, required=False)
    notes = NoteSerializer(required=False, many=True)
    bill = serializers.CharField(required=False)
    transaction_id = serializers.CharField(required=True)

    class Meta:
        list_serializer_class = UpdateTransactionListSerializer

    def validate_categories(self, value):

        percent_sum = sum([category['fraction'] for category in value])
        if percent_sum != 1:
            raise serializers.ValidationError('Fractions must sum to 1')
        return value


class TransactionSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, required=False)
    bill = BillSerializer()
    predicted_category = CategorySerializer()
    predicted_bill = BillSerializer()
    notes = NoteSerializer(many=True)

    class Meta:
        model = Transaction
        fields = '__all__'
