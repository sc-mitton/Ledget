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

    def _get_user_agent_kwargs(self):
        return Device.objects.parse_ua_dict(
            self.context['request'].ory_session.devices[0]['user_agent']
        )

    def create(self, validated_data):

        user = self.context['request'].user
        hash_token = self._get_hash_token()
        user_agent_kwargs = self._get_user_agent_kwargs()

        try:
            kwargs = {
                'user_id': str(user.id),
                'id': self.context['request'].ory_session.devices[0]['id'],
                'aal': self.context['request'].ory_session.aal,
                'location': self.context['request'].ory_session.devices[0]['location'],
                **user_agent_kwargs
            }
        except Exception as e:
            raise ValidationError(f'Error parsing new values: {e}')

        instance = Device.objects.create(token=hash_token, **kwargs)
        return instance

    def update(self, instance):

        try:
            user_agent_kwargs = self._get_user_agent_kwargs()
            new_values = {
                'location': self.context['request'].ory_session.devices[0]['location'],
                'token': self._get_hash_token(),
                **user_agent_kwargs
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
            self.context['request'].device == instance
        return representation
