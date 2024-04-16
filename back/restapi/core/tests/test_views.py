import json
from unittest import skip # noqa
from datetime import datetime

from django.urls import reverse

from restapi.tests.utils import timeit # noqa
from restapi.tests.mixins import ViewTestsMixin
from core.models import Device


class CoreViewTests(ViewTestsMixin):

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
            reverse('user_me'),
            data=json.dumps({"password_last_changed": "now"}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertIsInstance(self.user.password_last_changed, datetime)
