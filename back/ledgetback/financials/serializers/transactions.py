from rest_framework import serializers
from financials.models import PlaidItem


class TransactionsSyncSerializer(serializers.Serializer):
    item_id = serializers.CharField(required=True)

    def validate_item_id(self, value):
        try:
            item = PlaidItem.objects.get(id=value)
            return item
        except PlaidItem.DoesNotExist:
            raise serializers.ValidationError()
