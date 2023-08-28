from rest_framework.serializers import ModelSerializer

from ledgetback.serializers import (
    NestedCreateMixin,
    ListCreateSerializer
)
from .models import (
    Category,
    Alert,
    Bill,
    Reminder
)


class AlertSerializer(ModelSerializer):

    class Meta:
        model = Alert
        exclude = ['category']


class ReminderSerializer(ModelSerializer):

    class Meta:
        model = Reminder
        exclude = ['budget_bill']


class CategorySerializer(NestedCreateMixin, ModelSerializer):
    alerts = AlertSerializer(many=True)

    class Meta:
        model = Category
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['alerts']
        required_fields = ['name', 'period', 'limit_amount']
        list_serializer_class = ListCreateSerializer


class BillSerializer(NestedCreateMixin, ModelSerializer):
    reminders = ReminderSerializer(many=True)

    class Meta:
        model = Bill
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['reminders']
        required_fields = ['name', 'period', 'upper_amount']
        list_serializer_class = ListCreateSerializer
