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


class AccountListSerializer(serializers.ListSerializer):

    def update(self, instance, validated_data):
        account_mapping = {account.id: account for account in instance}
        data_mapping = {account['id']: account for account in validated_data}

        updated = []
        updated_keys = []
        new = []
        for account_id, data in data_mapping.items():
            account = account_mapping.get(account_id, None)
            if account:
                for attr, value in data.items():
                    if hasattr(account, attr):
                        updated_keys.append(attr)
                        setattr(account, attr, value)
                updated.append(account)
            else:
                new.append(self.child.Meta.model(**data))

        if new:
            self.child.Meta.model.objects.bulk_create(new)
        if updated:
            self.child.Meta.model.objects.bulk_update(updated, updated_keys)

        return new + updated


class AccountSerializer(serializers.ModelSerializer):
    institution = InstitutionSerializer()

    class Meta:
        model = Account
        fields = [field.name for field in model._meta.fields
                  if field.name != 'user'] + ['institution']
        exclude = ('plaid_item', 'institution')
        list_serializer_class = AccountListSerializer
