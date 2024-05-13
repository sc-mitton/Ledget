import json
from unittest import skip # noqa
from unittest.mock import patch, Mock
from datetime import datetime

from django.urls import reverse
from django.test import Client
from django.conf import settings

from restapi.tests.utils import timeit # noqa
from restapi.tests.mixins import ViewTestsMixin, session_payloads, encode_jwt
from core.models import Device


class TestUserViews(ViewTestsMixin):

    def test_get_me(self):
        response = self.client.get(reverse('user-me'))
        self.assertEqual(response.status_code, 200)

    def test_anonymous_user_get_me(self):
        client = Client()
        response = client.get(reverse('user-me'))
        self.assertEqual(response.status_code, 403)

    def test_update_onboarding_status(self):
        response = self.client.patch(
            reverse('user-me'),
            data=json.dumps({"is_onboarded": True}),
            content_type='application/json'
        )

        self.user.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.is_onboarded, True)

    def test_delete_remembered_device(self):
        device_id = self.client1_device['id']

        response = self.client.delete(
            reverse('device',  kwargs={'id': device_id})
        )
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Device.objects.filter(id=device_id).exists())

    def test_device_object_delete_permissions(self):
        other_device = self.aal2_client_device['id']

        response = self.client.delete(
            reverse('device',  kwargs={'id': other_device})
        )

        self.assertEqual(response.status_code, 403)
        self.assertTrue(Device.objects.filter(id=other_device).exists())

    def test_password_last_changed(self):
        response = self.client.patch(
            reverse('user-me'),
            data=json.dumps({"password_last_changed": "now"}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertIsInstance(self.user.password_last_changed, datetime)

    @patch('core.views.user.IdentityApi')
    def test_extend_user_session(self, identity_api_mock):
        identity_api_mock.return_value = Mock()

        session_payload = session_payloads[1]
        session_payload['session']['authentication_methods'][0]['method'] = 'oidc'

        self.client.defaults[settings.OATHKEEPER_AUTH_HEADER] = '{} {}'.format(
            settings.OATHKEEPER_AUTH_SCHEME, encode_jwt(session_payload))

        response = self.client.patch(reverse('session-extend'))
        self.assertEqual(response.status_code, 200)
