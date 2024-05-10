from rest_framework import serializers

from core.models import Account


class AccountSerializer(serializers.ModelSerializer):
    has_customer = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = '__all__'

    def get_has_customer(self, obj):
        return obj.has_customer


class DeleteRestartSubscriptionSerializer(serializers.Serializer):
    cancelation_reason = serializers.CharField(required=False)
    cancel_at_period_end = serializers.BooleanField(required=False)
    feedback = serializers.CharField(required=False)
