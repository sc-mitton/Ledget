from rest_framework import serializers

from .models import BudgetCategory, Alert


class AlertSerializer(serializers.ModelSerializer):

    class Meta:
        model = Alert
        fields = ['percent_amount']


class BudgetCategorySerializer(serializers.ModelSerializer):
    alerts = AlertSerializer(many=True)

    class Meta:
        model = BudgetCategory
        fields = ['name', 'emoji', 'type', 'limit_amount', 'alerts']

    def create(self, validated_data):
        alerts_data = validated_data.pop('alerts')

        validated_data['user'] = self.context['request'].user
        category = BudgetCategory.objects.create(**validated_data)

        for alert in alerts_data:
            Alert.objects.create(category=category, **alert)

        return category
