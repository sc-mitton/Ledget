from rest_framework import serializers

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


class BudgetCategorySerializer(serializers.ModelSerializer):
    alerts = AlertSerializer(many=True)

    class Meta:
        model = BudgetCategory
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['alerts']
        required_fields = ['name', 'type', 'limit_amount']

    def create(self, validated_data):
        alerts_data = validated_data.pop('alerts')

        validated_data['user'] = self.context['request'].user
        category = BudgetCategory.objects.create(**validated_data)

        alerts = []
        for alert in alerts_data:
            alerts.append(Alert(category=category, **alert))
        Alert.objects.bulk_create(alerts)

        return category


class BillSerializer(serializers.ModelSerializer):
    reminders = ReminderSerializer(many=True)

    class Meta:
        model = Bill
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['reminders']
        required_fields = ['name', 'type', 'upper_amount']

    def create(self, validated_data):
        reminders_data = validated_data.pop('reminders')

        validated_data['user'] = self.context['request'].user
        bill = Bill.objects.create(**validated_data)

        reminders = []
        for reminder in reminders_data:
            reminders.append(Reminder(bill=bill, **reminder))
        Reminder.objects.bulk_create(reminders)

        return bill

    def validate(self, data):
        """Check to make sure at least day_of_month
        or day_of_week and week are present."""

        missing_day_of_month = data.get('day') is None
        missing_week = data.get('week') is None
        missing_day_of_week = data.get('week_day') is None

        if missing_day_of_month and (missing_week or missing_day_of_week):
            raise serializers.ValidationError(
                "Must provide day or week_day and week"
            )
        return data
