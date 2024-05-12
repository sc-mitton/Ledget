import time
from unittest.mock import patch
import uuid
import hashlib
import json

import jwt
from jwcrypto.jwk import JWK
from django.urls import reverse
from django.test import TestCase, Client
from hooks.permissions import plaid_client
import plaid

body = {
  'environment': 'sandbox',
  'error': None,
  'item_id': 'NzAp6Lg5Las4LnAZzBR9Sggnpy4aPWIWa6mon',
  'new_webhook_url': 'https://d1fb-2601-681-77e-21e0-8154-afd5-81cf-2529.ngrok-free.app',  # noqa
  'webhook_code': 'WEBHOOK_UPDATE_ACKNOWLEDGED',
  'webhook_type': 'ITEM'
}
body_sha = hashlib.sha256()
body_sha.update(json.dumps(body, indent=2).encode('utf-8'))


class PlaidWebhooker:

    def __init__(self):
        self.key = JWK.generate(
            kty='EC',
            crv='P-256',
            alg='ES256',
            kid=str(uuid.uuid4())
        )
        private_key = self.key.export(private_key=True)
        self.private_key = jwt.algorithms.ECAlgorithm.from_jwk(private_key)

        self.public_key = self.key.export_public(as_dict=True)
        self.public_key['created_at'] = int(time.time())
        self.public_key['expired_at'] = None

    def refresh(self):
        self.__init__()

    @property
    def expired_header(self):
        expired_header = {
            'iat': int(time.time()) - 60 * 7,
            'request_body_sha256': body_sha.hexdigest()
        }
        return jwt.encode(
            expired_header,
            self.private_key,
            algorithm='ES256',
            headers={'kid': self.key['kid']}
        )

    @property
    def unexpired_header(self):
        unexpired_header = {
            'iat': int(time.time()),
            'request_body_sha256': body_sha.hexdigest()
        }
        return jwt.encode(
            unexpired_header,
            self.private_key,
            algorithm='ES256',
            headers={'kid': self.key['kid']}
        )

    @property
    def get_verification_key_response(self):
        return {
            'key': self.public_key,
            'request_id': 'ITA9y34uNvwvsKT',
        }


class BaseTest(TestCase):
    fixtures = [
        'plaid_item_fixture.json',
        'institution_fixture.json',
        'user_fixture.json',
        'core_account_fixture.json',
        'customer_fixture.json',
    ]

    def setUp(self):
        self.client = Client()
        self.plaid_webhooker = PlaidWebhooker()


class TestPlaidWebhookPermissions(BaseTest):

    @patch.object(plaid_client, 'webhook_verification_key_get')
    def test_came_from_plaid_permission(self, mock_get):
        mock_get.return_value = self.plaid_webhooker.get_verification_key_response

        # Test unexpired header
        response = self.client.post(
            reverse('plaid-webhook'),
            body,
            headers={'PLAID_VERIFICATION': self.plaid_webhooker.unexpired_header},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)

    @patch.object(plaid_client, 'webhook_verification_key_get')
    def test_came_from_plaid_permission_expired_header(self, mock_get):
        mock_get.return_value = self.plaid_webhooker.get_verification_key_response

        # Test expired header
        response = self.client.post(
            reverse('plaid-webhook'),
            body,
            headers={'PLAID_VERIFICATION': self.plaid_webhooker.expired_header},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 403)

    @patch.object(plaid_client, 'webhook_verification_key_get')
    def test_update_plaid_kids_cache(self, mock_get):
        '''
        Returning a verification key with a different kid should update the cache
        '''

        for _ in range(3):
            self.plaid_webhooker.refresh()
            mock_get.return_value = self.plaid_webhooker.get_verification_key_response

            response = self.client.post(
                reverse('plaid-webhook'),
                body,
                headers={'PLAID_VERIFICATION': self.plaid_webhooker.unexpired_header},
                content_type='application/json',
            )
            self.assertEqual(response.status_code, 200)


class TestPlaidException(BaseTest):

    @patch('hooks.permissions.plaid_client.webhook_verification_key_get')
    def test_webhook_verification_key_get_raise_error(self, mock_get):
        '''
        Test that the view returns a 403 if the Plaid API raises an exception
        '''

        mock_get.side_effect = plaid.ApiException('error')

        response = self.client.post(
            reverse('plaid-webhook'),
            body,
            headers={'PLAID_VERIFICATION': self.plaid_webhooker.unexpired_header},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 403)
