
from rest_framework import serializers
from django.contrib.auth import get_user_model
from models import Customer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        write_only_fields = ('password')
        op_kwargs = {'first_name': {'required': False},
                     'last_name': {'required': False}}

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['full_name'] = user.full_name
        # ...

        return token


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'stripe_customer_id',
                  'stripe_subscription_id']
        read_only_fields = ['id', 'stripe_customer_id',
                            'stripe_subscription_id']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
