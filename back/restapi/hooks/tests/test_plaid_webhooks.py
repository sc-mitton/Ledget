from unittest.mock import patch
import json

from django.test import TestCase, Client
from django.conf import settings
from django.urls import reverse

from financials.models import PlaidItem
from core.clients import create_plaid_client
from hooks.permissions import CameFromPlaid

plaid_client = create_plaid_client()


class PlaidWebhookTests(TestCase):
    fixtures = [
        'plaid_item_fixture.json',
        'institution_fixture.json',
        'user_fixture.json',
        'account_fixture.json',
        'customer_fixture.json',
        'user_account_fixture.json',
        'core_account_fixture.json',
    ]

    def setUp(self):
        self.client = Client()

    @patch.object(CameFromPlaid, 'has_permission')
    def test_plaid_webhook(self, mock_permission):
        mock_permission.return_value = True

        tests = [
            {
                'event': 'ERROR',
                'attributes': {
                    'login_required': True,
                }
            },
            {
                'event': 'PENDING_EXPIRATION',
                'attributes': {
                    'login_required': True,
                }
            },
            {
                'event': 'LOGIN_REPAIRED',
                'attributes': {
                    'login_required': False,
                    'pending_expiration': False,
                }
            },
            {
             'event': 'NEW_ACCOUNTS_AVAILABLE',
             'attributes': {
                 'new_accounts_available': True,
             }
            },
            {
                'event': 'USER_PERMISSION_REVOKED',
                'attributes': {
                    'permission_revoked': True,
                }
            }
        ]

        for test in tests:
            payload = self._get_plaid_webhook_object(test['event'].lower() + '.json')
            response = self.client.post(
                reverse('plaid-webhook'),
                payload,
                content_type='application/json'
            )

            # Checks
            item = PlaidItem.objects.get(id=payload['item_id'])
            self.assertEqual(response.status_code, 200)

            for key, value in test['attributes'].items():
                self.assertEqual(getattr(item, key), value)

    @patch('hooks.views.sync_transactions')
    @patch.object(CameFromPlaid, 'has_permission')
    def test_plaid_webhook_sync_transactions(self, mock_permission,
                                             mock_sync_transactions):
        mock_permission.return_value = True

        payload = self._get_plaid_webhook_object('sync_updates_available.json')
        response = self.client.post(
            reverse('plaid-webhook'),
            payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        mock_sync_transactions.assert_called_once()

    def _get_plaid_webhook_object(self, file) -> dict:

        file = settings.TEST_DATA_DIR / 'plaid_webhook_objects' / file
        with open(file) as f:
            payload_data = f.read()
            payload_data = json.loads(payload_data)
            return payload_data
