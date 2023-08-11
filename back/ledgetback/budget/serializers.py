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
        fields = ['percent_amount']


class ReminderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reminder
        fields = ['period', 'offset']


class BudgetCategorySerializer(serializers.ModelSerializer):
    alerts = AlertSerializer(many=True)

    class Meta:
        model = BudgetCategory
        fields = ['name', 'emoji', 'type', 'limit_amount', 'alerts']
        required_fields = ['name', 'type', 'limit_amount']

    def create(self, validated_data):
        alerts_data = validated_data.pop('alerts')

        validated_data['user'] = self.context['request'].user
        category = BudgetCategory.objects.create(**validated_data)

        for alert in alerts_data:
            Alert.objects.create(category=category, **alert)

        return category


class BillSerializer(serializers.ModelSerializer):
    reminders = ReminderSerializer(many=True)

    class Meta:
        model = Bill
        fields = ['name', 'emoji', 'type', 'lower_amount', 'upper_amount',
                  'day_of_month', 'day_of_week', 'week', 'month', 'reminders']
        required_fields = ['name', 'type', 'upper_amount']

    def create(self, validated_data):
        reminders_data = validated_data.pop('reminders')

        validated_data['user'] = self.context['request'].user
        bill = Bill.objects.create(**validated_data)

        for reminder in reminders_data:
            Reminder.objects.create(bill=bill, **reminder)

        return bill

    def validate(self, data):
        """Check to make sure at least day_of_month
        or day_of_week and week are present."""

        missing_day_of_month = data.get('day_of_month') is None
        missing_week = data.get('week') is None
        missing_day_of_week = data.get('day_of_week') is None

        if missing_day_of_month and (missing_week or missing_day_of_week):
            raise serializers.ValidationError(
                "Must provide day_of_month or day_of_week and week"
            )
