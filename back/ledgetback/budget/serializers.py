from datetime import datetime

from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
import logging

from ledgetback.serializer_mixins import NestedCreateMixin
from financials.models import TransactionCategory, Transaction
from .models import (
    Category,
    Alert,
    Bill,
    Reminder,
    UserCategory
)

logger = logging.getLogger('ledget')


class AlertSerializer(serializers.ModelSerializer):

    class Meta:
        model = Alert
        exclude = ['category']


class ReminderSerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=False)

    class Meta:
        model = Reminder
        fields = '__all__'
        read_only_fields = ['offset', 'period', 'active']


class CategoryListCreateSerializer(NestedCreateMixin, serializers.ListSerializer):

    def create(self, validated_data):
        instances = super().create(validated_data)
        self.context['request'].user.categories.add(*instances)
        return instances


class CategorySerializer(NestedCreateMixin, serializers.ModelSerializer):
    alerts = AlertSerializer(many=True, required=False)
    amount_spent = serializers.SerializerMethodField(read_only=True)
    has_transactions = serializers.SerializerMethodField(read_only=True)
    order = serializers.IntegerField(read_only=True)
    fraction = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Category
        exclude = ['is_default']
        extra_kwargs = {'limit_amount': {'required': True}}
        required_fields = ['name', 'period', 'limit_amount']
        list_serializer_class = CategoryListCreateSerializer

    @transaction.atomic
    def create(self, validated_data, *args, **kwargs):
        instance = super().create(validated_data, *args, **kwargs)
        UserCategory.objects.create(
            user_id=self.context['request'].user.id,
            category_id=instance.id,
            order=0)
        return instance

    @transaction.atomic
    def update(self, instance, validated_data, *args, **kwargs):
        '''
        Update the category instance and its alerts. If the category's limit
        is being updated, then a new category will be created if the category
        is older than a month. All transactions for the month that were
        connected to the old category will be reconnected to the new category.
        '''
        if 'limit_amount' in validated_data and \
                instance.created.month < datetime.now().month - 1:
            instance.removed_on = timezone.now()

            new_instance = self.create(validated_data)

            TransactionCategory.objects.filter(
                    category=instance,
                    transaction__date__month=datetime.now().month) \
                .update(category=new_instance)

            return new_instance

        # Update the object instance and save it to the db
        try:
            alerts = self._get_or_create_alerts(
                instance, validated_data.pop('alerts', []))
            print('alerts', alerts)

            for field, value in validated_data.items():
                setattr(instance, field, value)
            instance.alerts.set(alerts)
            instance.save()
        except Exception as e:
            logger.error(e)
            raise serializers.ValidationError(e)

        return instance

    def _get_or_create_alerts(self, instance, validated_alert_data):
        '''
        Takes a list of validated alert data and returns a list of alert objects
        that are either new alerts or existing alerts that have been updated.
        '''
        new_alerts, alert_ids = [], []

        for alert in validated_alert_data:
            # Validated alert data without an id means it's new
            if alert.get('id', False):
                alert_ids.append(alert.get('id'))
            else:
                new_alerts.append(Alert(category=instance, **alert))

        create_alerts = Alert.objects.bulk_create(new_alerts)
        for alert in create_alerts:
            alert_ids.append(str(alert.id))

        return Alert.objects.filter(id__in=alert_ids)

    def get_amount_spent(self, obj):
        if hasattr(obj, 'amount_spent'):
            return obj.amount_spent

    def get_has_transactions(self, obj):
        if hasattr(obj, 'has_transactions'):
            return obj.has_transactions


class SpendingHistorySerializer(serializers.Serializer):
    month = serializers.IntegerField()
    year = serializers.IntegerField()
    amount_spent = serializers.DecimalField(max_digits=10, decimal_places=2)


class BillListCreateSerializer(serializers.ListSerializer):

    def create(self, validated_data):
        instances = self._create_bills(validated_data)
        self.context['request'].user.bills.add(*instances)

        return instances

    def _create_bills(self, validated_data):
        reminders = self._get_reminder_objects(validated_data)

        bills_reminder_map = {reminder_id: [] for reminder_id in reminders}
        new_bill_instances = []

        for data in validated_data:
            reminder_ids = [reminder.get('id', None)
                            for reminder in data.pop('reminders', [])]
            new_bill_instances.append(Bill(**data))

            # Add the bill to all of the reminders in the map
            for id in reminder_ids:
                bills_reminder_map[id].append(new_bill_instances[-1])

        Bill.objects.bulk_create(new_bill_instances)
        for reminder_id, bills in bills_reminder_map.items():
            reminders[reminder_id].bills.add(*bills)

        return new_bill_instances

    def _get_reminder_objects(self, validated_data) -> dict:
        reminder_ids = []
        for data in validated_data:
            for reminder in data.get('reminders', []):
                reminder_ids.append(reminder.get('id', None))
        instances = Reminder.objects.filter(id__in=reminder_ids)
        return {str(instance.id): instance for instance in instances}

    def update(self, validated_data):
        raise NotImplementedError('Update not implemented for lists of bills')


class BillSerializer(NestedCreateMixin, serializers.ModelSerializer):
    reminders = ReminderSerializer(many=True, required=False)
    is_paid = serializers.SerializerMethodField(read_only=True)
    last_paid = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Bill
        fields = '__all__'
        required_fields = ['name', 'period', 'upper_amount']
        list_serializer_class = BillListCreateSerializer

    def update(self, instance, validated_data, *args, **kwargs):
        if ('lower_amount' in validated_data or 'upper_amount' in validated_data) \
             and instance.created.month < datetime.now().month - 1:

            instance.removed_on = timezone.now()
            new_instance = self.create(validated_data)

            Transaction.objects.filter(
                        bill=instance,
                        date__month=datetime.now().month) \
                .update(bill=new_instance)

        reminders = validated_data.pop('reminders', [])
        reminder_ids = [reminder.get('id', None)
                        for reminder in reminders
                        if reminder.get('id', None)]
        reminders = Reminder.objects.filter(id__in=reminder_ids)

        try:
            for field, value in validated_data.items():
                setattr(instance, field, value)
            instance.reminders.set(reminders)
            instance.save()
        except Exception as e:
            logger.error(e)
            raise serializers.ValidationError(e)

        return instance

    @transaction.atomic
    def create(self, validated_data, *args, **kwargs):
        reminders = validated_data.pop('reminders', [])
        reminder_ids = [reminder.get('id', None)
                        for reminder in reminders
                        if reminder.get('id', False)]
        instance = super().create(validated_data, *args, **kwargs)

        reminders = Reminder.objects.filter(id__in=reminder_ids)
        instance.reminders.add(*reminders)
        instance.users.add(self.context['request'].user)

        return instance

    def get_is_paid(self, obj):
        if hasattr(obj, 'is_paid'):
            return obj.is_paid

    def get_last_paid(self, obj):
        if hasattr(obj, 'last_paid'):
            return obj.last_paid
