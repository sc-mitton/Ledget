from rest_framework import serializers

from financials.models import Transaction, Note
from budget.serializers import CategorySerializer, BillSerializer
from budget.models import Bill, TransactionCategory


class NoteSerializer(serializers.ModelSerializer):
    is_current_users = serializers.SerializerMethodField()

    class Meta:
        model = Note
        exclude = ('transaction',)

    def get_is_current_users(self, obj):
        return obj.user == self.context['request'].user


class UpdateTransactionListSerializer(serializers.ListSerializer):

    def update(self, instances, validated_data):
        bill_ids = [item['bill'] for item in validated_data if item.get('bill', None)]
        bill_objs = self._get_bill_objects(bill_ids)

        updated_transactions = []
        created_transaction_categories = []
        for i, data in enumerate(validated_data):
            bill_id = data.get('bill', False)
            split_data = data.get('splits', False)
            instance = instances[i]

            if bill_id:
                instance.bill = bill_objs[bill_id]
                updated_transactions.append(instance)
            elif split_data:
                created_transaction_categories = [
                    TransactionCategory(
                        transaction=instance,
                        **split
                    ) for split in split_data
                ]

        Transaction.objects.bulk_update(updated_transactions, ['bill'])
        TransactionCategory.objects.bulk_create(
            created_transaction_categories,
            update_conflicts=True,
            update_fields=['category', 'fraction'],
            unique_fields=['transaction', 'category']
        )

        return instances

    def _get_bill_objects(self, bill_ids):
        try:
            bills_qset = Bill.objects.filter(id__in=bill_ids)
            bills = {str(bill.id): bill for bill in bills_qset}
        except Bill.DoesNotExist:
            raise serializers.ValidationError(
                'One or more of the bills does not exist.')
        return bills

    def save(self, **kwargs):
        self.update(self.instance, self.validated_data)


class TransactionCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = TransactionCategory
        fields = ('category', 'fraction',)


class UpdateTransactionsConfirmationSerializer(serializers.Serializer):
    splits = TransactionCategorySerializer(many=True, required=False)
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
