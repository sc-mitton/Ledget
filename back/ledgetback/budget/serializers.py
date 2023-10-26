from rest_framework.serializers import ModelSerializer, ListSerializer as LS
from rest_framework.serializers import SerializerMethodField
from django.db import transaction

from ledgetback.serializers import NestedCreateMixin
from .models import (
    Category,
    Alert,
    Bill,
    Reminder,
    UserBill,
    UserCategory
)


class ListCreateSerializer(NestedCreateMixin, LS):

    def create(self, validated_data):
        validated_data = [{
            'user_id': self.context['request'].user.id,
            **data
        } for data in validated_data]

        return super().create(validated_data)


class AlertSerializer(ModelSerializer):

    class Meta:
        model = Alert
        exclude = ['category']


class ReminderSerializer(ModelSerializer):

    class Meta:
        model = Reminder
        exclude = ['bill']


class CategorySerializer(NestedCreateMixin, ModelSerializer):
    alerts = AlertSerializer(many=True, required=False)
    amount_spent = SerializerMethodField(read_only=True)

    class Meta:
        model = Category
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['alerts', 'amount_spent']
        extra_kwargs = {'limit_amount': {'required': True}}
        required_fields = ['name', 'period', 'limit_amount']
        list_serializer_class = ListCreateSerializer

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
        return obj.amount_spent


class BillSerializer(NestedCreateMixin, ModelSerializer):
    reminders = ReminderSerializer(many=True, required=False)

    class Meta:
        model = Bill
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['reminders']
        required_fields = ['name', 'period', 'upper_amount']
        list_serializer_class = ListCreateSerializer

    @transaction.atomic
    def create(self, validated_data, *args, **kwargs):
        instance = super().create(validated_data, *args, **kwargs)
        UserBill.objects.create(
            user_id=self.context['request'].user.id,
            bill_id=instance.id,
            order=0
        )
        return instance
