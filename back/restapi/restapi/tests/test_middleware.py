import hashlib

from django.test import TestCase, Client
from django.urls import reverse
from django.conf import settings
from django.contrib.auth import get_user_model

from restapi.tests.mixins import session_payloads, tokens
from core.models import Account

ORY_SESSION_TOKEN_HEADER = settings.ORY_SESSION_TOKEN_HEADER


class TestCsrfMiddleware(TestCase):

    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        account = Account.objects.create()
        get_user_model().objects.create_user(
            id=session_payloads[1]['session']['identity']['id'],
            account=account
        )

        session_id = session_payloads[1]['session']['id']
        unhashed = ''.join([settings.SECRET_KEY, session_id])
        hmac = hashlib.sha256(unhashed.encode('utf-8')).hexdigest()
        self.csrf_hmac = hmac

    def test_csrf_middleware_success(self):

        # Fabricate csrf token

        response = self.client.post(
            reverse('feedback'),
            {'feedback': 'This is a test feedback'},
            headers={
                'Origin': settings.CSRF_TRUSTED_ORIGINS[0],
                'Authorization': f'Bearer {tokens[1]}',
                'x-csrftoken': self.csrf_hmac,
                'host': 'localhost'
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_csrf_middleware_no_auth_header_error(self):
        '''
        Test sending request without auth header
        '''

        response = self.client.post(
            reverse('feedback'),
            {'feedback': 'This is a test feedback'},
            headers={
                'Origin': settings.CSRF_TRUSTED_ORIGINS[0],
                'x-csrftoken': self.csrf_hmac,
                'host': 'localhost'
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_token_header_csrf_exempt(self):
        '''
        Test that requests with the session token header set are
        exempt from CSRF checks
        '''

        self.client.defaults[ORY_SESSION_TOKEN_HEADER] = 'fake_session_token'
        response = self.client.post(
            reverse('feedback'),
            {'feedback': 'This is a test feedback'},
            headers={
                'Origin': settings.CSRF_TRUSTED_ORIGINS[0],
                'Authorization': f'Bearer {tokens[1]}',
                'host': 'localhost'
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_bad_csrf_token(self):
        '''
        Test sending request with bad csrf token
        '''

        # Test with malformed csrf token
        headers = {
                'Origin': settings.CSRF_TRUSTED_ORIGINS[0],
                'Authorization': f'Bearer {tokens[1]}',
                'x-csrftoken': 'bad_csrf_token',
                'host': 'localhost'
            }

        response = self.client.post(
            reverse('feedback'),
            headers=headers,
        )
        self.assertEqual(response.status_code, 403)

        # Test with incorrect token
        headers['x-csrftoken'].replace('a', 'b').replace('c', 'd').replace('e', 'f')
        response = self.client.post(
            reverse('feedback'),
            headers=headers,
        )
        self.assertEqual(response.status_code, 403)

        # Test without x-csrftoken
        del headers['x-csrftoken']
        response = self.client.post(
            reverse('feedback'),
            headers=headers,
        )
        self.assertEqual(response.status_code, 403)
