from rest_framework import serializers

from ledgetback.serializers.mixins import NestedCreateMixin
from .models import (
    Category,
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
        exclude = ['budget_bill']


class CategorySerializer(NestedCreateMixin, serializers.ModelSerializer):
    alerts = AlertSerializer(many=True)

    class Meta:
        model = Category
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['alerts']
        required_fields = ['name', 'period', 'limit_amount']


class BillSerializer(NestedCreateMixin, serializers.ModelSerializer):
    reminders = ReminderSerializer(many=True)

    class Meta:
        model = Bill
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['reminders']
        required_fields = ['name', 'period', 'upper_amount']
