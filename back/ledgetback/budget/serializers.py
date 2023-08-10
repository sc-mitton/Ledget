from rest_framework.serializers import ModelSerializer

from .models import BudgetCategory, Alert


class BudgetCategorySerializer(ModelSerializer):

    class Meta:
        model = BudgetCategory
        fields = ['name', 'emoji', 'type', 'limit_amount', 'alerts']
        depth = 1


class AlertSerializer(ModelSerializer):

    class Meta:
        model = Alert
        fields = ['percent_amount']
