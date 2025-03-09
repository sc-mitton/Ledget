from rest_framework import serializers

from core.models import Account, Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('subscription_status', 'period_end',)


class AccountSerializer(serializers.ModelSerializer):
    has_customer = serializers.SerializerMethodField()
    service_provisioned_until = serializers.SerializerMethodField()
    customer = CustomerSerializer(required=False, read_only=True)

    class Meta:
        model = Account
        fields = '__all__'

    def get_has_customer(self, obj):
        return obj.has_customer

    def get_service_provisioned_until(self, obj):
        return obj.service_provisioned_until


class DeleteRestartSubscriptionSerializer(serializers.Serializer):
    cancelation_reason = serializers.CharField(required=False)
    cancel_at_period_end = serializers.BooleanField(required=False)
    feedback = serializers.CharField(required=False)
