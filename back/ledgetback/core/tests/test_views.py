import json
from unittest import skip # noqa
from unittest.mock import patch

from django.urls import reverse

from ledgetback.tests.utils import timeit # noqa
from ledgetback.tests.mixins import ViewTestsMixin
from core.models import Device


class CoreViewTests(ViewTestsMixin):

    @patch('core.views.user.UserSerializer.get_subscription')
    def test_user_me(self, mock_get_subscription):
        # Mock the get_subscription method to return a predefined value
        mock_get_subscription.return_value = {
            'id': 'fake_subscription_id',
            'status': 'active',
            'current_period_end': 1234567890,
            'cancel_at_period_end': False,
            'plan': {
                'id': 'fake_plan_id',
                'amount': 999,
                'nickname': 'Fake Plan',
                'interval': 'month',
            }
        }

        response = self.client.get(reverse('user_me'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(str(response.data['id']), str(self.user.id))

        # Verify that get_subscription was called once
        mock_get_subscription.assert_called_once()

    def test_update_onboarding_status(self):
        response = self.client.patch(
            reverse('user_me'),
            data=json.dumps({"is_onboarded": True}),
            content_type='application/json'
        )

        self.user.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.is_onboarded, True)

    def test_delete_remembered_device(self):
        device_id = self.aal1_payload['session']['devices'][0]['id']

        response = self.client.delete(
            reverse('devices-destroy',  kwargs={'pk': device_id})
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Device.objects.filter(id=device_id).exists())

    def test_device_object_delete_permissions(self):
        other_device = self.aal2_payload['session']['devices'][0]['id']

        response = self.client.delete(
            reverse('devices-destroy',  kwargs={'pk': other_device})
        )

        self.assertEqual(response.status_code, 403)
        self.assertTrue(Device.objects.filter(id=other_device).exists())
