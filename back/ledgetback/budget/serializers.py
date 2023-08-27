from rest_framework import serializers

from ledgetback.serializers.mixins import NestedCreateMixin
from .models import (
    BudgetCategory,
    Alert,
    Bill,
    Reminder
)


class AlertSerializer(serializers.ModelSerializer):

    class Meta:
        model = Alert
        exclude = ['category']


class ReminderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reminder
        exclude = ['bill']


class BudgetCategorySerializer(serializers.ModelSerializer, NestedCreateMixin):
    alerts = AlertSerializer(many=True)

    class Meta:
        model = BudgetCategory
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['alerts']
        required_fields = ['name', 'period', 'limit_amount']


class BillSerializer(serializers.ModelSerializer, NestedCreateMixin):
    reminders = ReminderSerializer(many=True)

    class Meta:
        model = Bill
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['reminders']
        required_fields = ['name', 'period', 'upper_amount']
