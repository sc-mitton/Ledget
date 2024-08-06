import json
from pathlib import Path

from django.test import TestCase, Client
from django.conf import settings
from django.urls import reverse


class TestOryWebhooks(TestCase):

    def setUp(self):
        self.client = Client()
        self.client.defaults[settings.ORY_HOOK_AUTH_HEADER] = '{} {}'.format(
            settings.ORY_HOOK_AUTH_SCHEME,
            settings.ORY_HOOK_API_KEY
        )
        self.webhook_payload = None
        with open(Path(__file__).parent / 'ory_webook_payload.json', 'r') as f:
            self.webhook_payload = json.load(f)

    def test_ory_registration_webhook(self):

        response = self.client.post(
            reverse('ory-registration-hook'),
            self.webhook_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

    def test_ory_password_changed_webhook(self):

        self.test_ory_registration_webhook()

        response = self.client.post(
            reverse('ory-settings-password-hook'),
            self.webhook_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

    def test_ory_verification_hook(self):

        self.test_ory_registration_webhook()

        response = self.client.post(
            reverse('ory-verification-hook'),
            self.webhook_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

    def test_ory_verification_security(self):
        '''
        Make sure webhook fails when no auth header is provided
        '''

        response = Client().post(
            reverse('ory-registration-hook'),
            self.webhook_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)
