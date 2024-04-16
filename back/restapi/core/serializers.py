import hashlib
import logging

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.conf import settings
import stripe
from user_agents import parse as ua_parse
from django.utils import timezone
from rest_framework.exceptions import APIException


from core.models import User, Device

stripe.api_key = settings.STRIPE_API_KEY
stripe_logger = logging.getLogger('stripe')
ledget_logger = logging.getLogger('ledget')


class ServiceUnavailable(APIException):
    status_code = 503
    default_detail = 'Service temporarily unavailable, try again later.'
    default_code = 'service_unavailable'


class NewSubscriptionSerializer(serializers.Serializer):
    price_id = serializers.CharField()
    trial_period_days = serializers.IntegerField(required=False)

    def validate_trial_period_days(self, value):
        if value > 30:
            raise serializers.ValidationError(
                'Trial period cannot be longer than 30 days.'
            )
        return value


class UserSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField(read_only=True)
    name = serializers.SerializerMethodField(read_only=True)
    is_customer = serializers.SerializerMethodField(read_only=True)
    is_verified = serializers.SerializerMethodField(read_only=True)
    service_provisioned_until = serializers.SerializerMethodField(
        read_only=True)
    subscription_status = serializers.SerializerMethodField(read_only=True)
    highest_aal = serializers.SerializerMethodField(read_only=True)
    password_last_changed = serializers.CharField(required=False)
    last_login = serializers.SerializerMethodField(read_only=True)
    session = serializers.SerializerMethodField(read_only=True)
    session_aal = serializers.SerializerMethodField(read_only=True)  # DELETE

    class Meta:
        model = User
        exclude = ('is_active', )
        kwargs = {'account_flag': {'read_only': True}}

    def update(self, instance, validated_data):
        password_last_changed = validated_data.pop('password_last_changed', None)
        if password_last_changed:
            instance.password_last_changed = timezone.now()
        return super().update(instance, validated_data)

    def validate_password_last_changed(self, value):
        return value == 'now'

    def get_email(self, obj):
        return obj.traits.get('email', '')

    def get_is_customer(self, obj):
        return obj.is_customer

    def get_name(self, obj):
        return obj.traits.get('name', {})

    def get_is_verified(self, obj):
        return obj.is_verified

    def get_service_provisioned_until(self, obj):
        return obj.service_provisioned_until

    # DELETE
    def get_session_aal(self, obj):
        return obj.session_aal

    def get_session(self, obj):
        return {
            'aal': self.context['request'].ory_session.aal,
            'auth_methods': self.context['request'].ory_session.devices
        }

    def get_highest_aal(self, obj):
        return obj.highest_aal

    def get_subscription_status(self, obj):
        return obj.customer.subscription_status

    def get_last_login(self, obj):
        if obj.device:
            return obj.device.last_login
        else:
            return None


class PaymentMethodSerializer(serializers.Serializer):
    payment_method_id = serializers.CharField(required=False)
    old_payment_method_id = serializers.CharField(required=False)


class SubscriptionItemsSerializer(serializers.Serializer):
    price = serializers.CharField()


class SubscriptionUpdateSerializer(serializers.Serializer):
    feedback = serializers.CharField(required=False)
    cancelation_reason = serializers.CharField(required=False)
    cancel_at_period_end = serializers.BooleanField(required=False)


# Instead of storing the hashed token in the database, we could store
# a shared secret and use a HMAC to verify the token. This would allow
# us to invalidate all tokens for a user by changing the shared secret.
class DeviceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Device
        exclude = ('user', 'token', )

    def _get_hash_token(self):
        # create sha256 hash of device id, user, user_agent,
        # location, and secret key
        user = self.context['request'].user
        unhashed = ''.join([
            self.context['request'].ory_session.devices[0]['id'],
            self.context['request'].ory_session.aal,
            str(user.id),
            settings.SECRET_KEY
        ])

        hash_value = hashlib.sha256((unhashed).encode('utf-8')).hexdigest()
        return hash_value

    def _parse_user_agent_kwargs(self):
        ua_string = self.context['request'].ory_session.devices[0]['user_agent']
        user_agent = ua_parse(ua_string)

        kwargs = {}
        for attr in Device._meta.get_fields():
            if attr.name.startswith('is_'):
                kwarg_keys = [attr.name]
            else:
                kwarg_keys = attr.name.split('_')

            kwarg_value_temp = user_agent
            for key in kwarg_keys:
                kwarg_value_temp = getattr(kwarg_value_temp, key, None)

            if kwarg_value_temp:
                kwargs[attr.name] = kwarg_value_temp

        return kwargs

    def create(self, validated_data):

        user = self.context['request'].user
        hash_token = self._get_hash_token()

        try:
            kwargs = {
                'user_id': str(user.id),
                'id': self.context['request'].ory_session.devices[0]['id'],
                'aal': self.context['request'].ory_session.aal,
                'location': self.context['request'].ory_session.devices[0]['location'],
                **self._parse_user_agent_kwargs()
            }
        except Exception as e:
            raise ValidationError(f'Error parsing new values: {e}')

        instance = Device.objects.create(token=hash_token, **kwargs)
        return instance

    def update(self, instance):

        try:
            new_values = {
                'location': self.context['request'].ory_session.devices[0]['location'],
                'token': self._get_hash_token(),
                **self._parse_user_agent_kwargs()
            }
        except Exception as e:
            raise ValidationError(f'Error parsing new values: {e}')

        for key, value in new_values.items():
            setattr(instance, key, value)
        if self.context['request'].ory_session.aal == 'aal2':
            instance.aal = 'aal2'

        instance.save()

    def to_representation(self, instance):
        '''
        Indicate if the device is the current device for the user when
        sending back data
        '''
        representation = super().to_representation(instance)
        representation['current_device'] = \
            self.context['request'].user.device == instance
        return representation


class EmailSerializer(serializers.Serializer):
    text = serializers.CharField(required=False)
    detail = serializers.CharField(required=False)
