from rest_framework.serializers import ModelSerializer, ListSerializer as LS
from rest_framework.serializers import SerializerMethodField
from django.db import transaction

from ledgetback.serializers import NestedCreateMixin
from .models import (
    Category,
    Alert,
    Bill,
    Reminder,
    UserCategory
)


class AlertSerializer(ModelSerializer):

    class Meta:
        model = Alert
        exclude = ['category']


class ReminderSerializer(ModelSerializer):

    class Meta:
        model = Reminder
        exclude = ['bill']


class CategoryListCreateSerializer(NestedCreateMixin, LS):

    def create(self, validated_data):
        instances = super().create(validated_data)
        self.context['request'].user.categories.add(*instances)
        return instances


class CategorySerializer(NestedCreateMixin, ModelSerializer):
    alerts = AlertSerializer(many=True, required=False)
    amount_spent = SerializerMethodField(read_only=True)

    class Meta:
        model = Category
        fields = '__all__'
        extra_kwargs = {'limit_amount': {'required': True}}
        required_fields = ['name', 'period', 'limit_amount']
        list_serializer_class = CategoryListCreateSerializer

    @transaction.atomic
    def create(self, validated_data, *args, **kwargs):
        instance = super().create(validated_data, *args, **kwargs)
        UserCategory.objects.create(
            user_id=self.context['request'].user.id,
            category_id=instance.id,
            order=0
        )
        return instance

    def get_amount_spent(self, obj):
        if hasattr(obj, 'amount_spent'):
            return obj.amount_spent


class BillListCreateSerializer(NestedCreateMixin, LS):

    def create(self, validated_data):
        instances = super().create(validated_data)
        self.context['request'].user.bills.add(*instances)
        return instances


class BillSerializer(NestedCreateMixin, ModelSerializer):
    reminders = ReminderSerializer(many=True, required=False)
    is_paid = SerializerMethodField(read_only=True)

    class Meta:
        model = Bill
        fields = '__all__'
        required_fields = ['name', 'period', 'upper_amount']
        list_serializer_class = BillListCreateSerializer

    @transaction.atomic
    def create(self, validated_data, *args, **kwargs):
        instance = super().create(validated_data, *args, **kwargs)
        instance.users.add(self.context['request'].user)

        return instance

    def get_is_paid(self, obj):
        if hasattr(obj, 'is_paid'):
            return obj.is_paid
