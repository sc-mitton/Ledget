import hashlib

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.conf import settings
from user_agents import parse as ua_parse


from core.models import Device

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
