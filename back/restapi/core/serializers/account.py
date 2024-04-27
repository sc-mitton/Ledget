from rest_framework import serializers

from core.models import Account


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = '__all__'


class AccountUpdateSerializer(serializers.Serializer):
    cancelation_reason = serializers.CharField(required=False)
    cancel_at_period_end = serializers.BooleanField(required=False)
