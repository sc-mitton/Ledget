import logging

from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user_model

logger = logging.getLogger('ledget')


class OryBackend(SessionAuthentication):

    def authenticate(self, request):
        """
        Validate the JWT token against the Oathkeeper public key and
        set the user in the request. If the token is absent, invalid,
        or expired, return None.
        """

        # header should already be decoded by middleware

        decoded_jwt = request.META.get('HTTP_AUTHORIZATION')
        if not decoded_jwt:
            return

        try:
            user = self.get_user(request, decoded_jwt)
        except Exception as e:
            logger.error(f"{e.__class__.__name__} {e}")
            return None

        return (user, None)

    def get_user(self, request, decoded_token: dict):
        """Return the user from the decoded token."""
        device_token = request.COOKIES.get('ledget_device')
        identity = decoded_token['session']['identity']

        User = get_user_model()
        user = User.objects \
                   .prefetch_related('device__set') \
                   .select_related('customer') \
                   .get(pk=identity['id']) \

        for device in user.device_set.all():
            if device.token == device_token:
                user.device = device

        user.session_id = decoded_token['session']['id']
        user.session_aal = \
            decoded_token['session']['authenticator_assurance_level']
        user.traits = identity.get('traits', {})

        if request.path.endswith('devices'):
            user.session_devices = decoded_token['session']['devices']

        return user
