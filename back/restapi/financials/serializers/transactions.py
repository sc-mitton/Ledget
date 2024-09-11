from rest_framework import serializers
from django.db import transaction
from datetime import datetime

from financials.models import Transaction, Note
from budget.models import Bill, TransactionCategory, Category
from budget.serializers import BillSerializer


class NoteSerializer(serializers.ModelSerializer):
    is_current_users = serializers.SerializerMethodField()

    class Meta:
        model = Note
        exclude = ('transaction',)

    def get_is_current_users(self, obj):
        return obj.user == self.context['request'].user


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('merchant_name',)
        read_only_fields = ('merchant_name',)

    def to_representation(self, instance):
        return instance.get('merchant_name')


class UpdateTransactionListSerializer(serializers.ListSerializer):

    @transaction.atomic
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

        TransactionCategory.objects.filter(
            transaction__in=[str(t.pk) for t in instances]).delete()
        TransactionCategory.objects.bulk_create(created_transaction_categories)

        if updated_transactions:
            Transaction.objects.bulk_update(updated_transactions, ['bill'])

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


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'


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

    def update(self, instance, validated_data):
        if any(key in validated_data for key in
               ['category', 'category_id', 'bill', 'bill_id']):
            validated_data['confirmed_date'] = datetime.now()
            validated_data['confirmed_datetime'] = datetime.now()
        if all(key not in validated_data for key in
               ['category', 'category_id', 'bill', 'bill_id']):
            nullified_fields = ['predicted_category', 'predicted_bill']
            validated_data.update({field: None for field in nullified_fields})

        return super().update(instance, validated_data)


class SplitsSerializer(serializers.Serializer):
    category = CategorySerializer()

    class Meta:
        model = TransactionCategory
        fields = ('category', 'fraction',)

    def to_representation(self, instance):
        repr = {
            **super().to_representation(instance).get('category'),
            'fraction': instance.fraction
        }
        return repr


class TransactionSerializer(serializers.ModelSerializer):
    splits = SplitsSerializer(many=True, required=False)
    bill = BillSerializer(required=False)
    predicted_category = CategorySerializer()
    predicted_bill = BillSerializer()
    notes = NoteSerializer(many=True)

    class Meta:
        model = Transaction
        fields = '__all__'

    def update(sef, instance, validated_data):

        if (validated_data.get('is_spend') is False):
            TransactionCategory.objects.filter(transaction=instance).delete()
            nullified_fields = ['predicted_category', 'predicted_bill', 'bill']
            validated_data.update({field: None for field in nullified_fields})

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        # Rename splits to categories
        repr = super().to_representation(instance)
        if 'splits' in repr:
            repr['categories'] = repr.pop('splits')
        return repr
