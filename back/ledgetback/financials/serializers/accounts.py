import base64

from rest_framework import serializers

from financials.models import Account, Institution


class CustomBase64ImageField(serializers.Field):
    def to_representation(self, value):
        if value and value.path:
            with open(value.path, "rb") as f:
                return base64.b64encode(f.read()).decode("utf-8")
        else:
            return None


class InstitutionSerializer(serializers.ModelSerializer):
    logo = CustomBase64ImageField(required=False, read_only=True)
    id = serializers.CharField()

    class Meta:
        model = Institution
        fields = '__all__'


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        exclude = ('plaid_item', 'institution')
