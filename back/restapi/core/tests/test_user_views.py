import json
from unittest import skip # noqa
from unittest.mock import patch, Mock
from datetime import datetime
import uuid
from pathlib import Path

from django.urls import reverse
from django.test import Client
from django.conf import settings
from django.contrib.auth import get_user_model
import ory_client

from restapi.tests.utils import timeit # noqa
from restapi.tests.mixins import ViewTestsMixin, session_payloads, encode_jwt
from core.models import Device
from core.views.service import stripe as service_stripe


class TestUserViews(ViewTestsMixin):

    def setUp(self):
        super().setUp()

        # Mocking response file
        file = Path(__file__).parent / 'mock_recovery_link_response.json'
        with open(file) as f:
            self.create_recovery_code_for_identity = json.load(f)

        # Create co owner for self.user
        get_user_model().objects.create(account=self.user.account)

    def test_get_me(self):
        response = self.client.get(reverse('user-me'))
        self.assertEqual(response.status_code, 200)

    @patch('core.views.user.IdentityApi')
    def test_get_co_owner(self, identity_api_mock):
        mock = Mock()
        identity_api_mock.return_value = mock
        fake_email = 'foobar@test.com'
        mock.get_identity.return_value = {
            'traits': {
                'email': fake_email,
                'name': {
                    'first': 'Foo',
                    'last': 'Bar'
                }
            }
        }
        response = self.client.get(reverse('user-co-owner'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], fake_email)

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

    @patch('core.views.user.IdentityApi')
    def test_add_user_to_account_view(self, identity_api_mock):

        # Mocking
        mock = Mock()
        identity_api_mock.return_value = mock
        mock.create_identity.return_value = {'id': str(uuid.uuid4())}

        # Test
        response = self.aal2_client.post(
            reverse('add-user-to-account'),
            data=json.dumps({"email": "newaccountemail@test.com"}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data['recovery_link'])
        self.assertIsNotNone(response.data['expires_at'])

    @patch('core.views.user.IdentityApi')
    def test_retry_add_user_to_account(self, identity_api_mock):

        # Mocking
        mock = Mock()
        identity_api_mock.return_value = mock
        mock.create_identity.side_effect = ory_client.ApiException(
            status=409,
            reason='Conflict'
        )
        mock.list_identities.return_value = [{'id': str(uuid.uuid4())}]

        # Test
        response = self.aal2_client.post(
            reverse('add-user-to-account'),
            data=json.dumps({"email": "newaccountemail@test.com"}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data['recovery_link'])
        self.assertIsNotNone(response.data['expires_at'])

    @patch.object(service_stripe, 'Customer')
    @patch.object(service_stripe, 'PaymentMethod')
    def test_update_default_payment_method(self, payment_method_mock, customer_mock):
        old_payment_method = 'pm_456'
        new_payment_method = 'pm_123'

        response = self.client.post(
            reverse('default-payment-method'),
            data=json.dumps({
                'payment_method_id': new_payment_method,
                'old_payment_method_id': old_payment_method
            }),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        payment_method_mock.detach.assert_called_once_with(
            old_payment_method
        )
        customer_mock.modify.assert_called_once_with(
            self.user.account.customer.id,
            invoice_settings={'default_payment_method': new_payment_method}
        )

    def test_update_user_settings(self):
        response = self.client.patch(
            reverse('user-settings'),
            data=json.dumps({'automatic_logout': True}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.settings.automatic_logout)
