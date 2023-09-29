from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.conf import settings
from django.urls import reverse

import uuid
import jwt
from core.models import Customer

public_key = settings.OATHKEEPER_PUBLIC_KEY
private_key = settings.OATHKEEPER_PRIVATE_KEY

session_payloads = [
    {
        'session': {
            'devices': [
                {
                    'id': str(uuid.uuid4()),
                    'ip_address': '76.27.80.128',
                    'location': 'American Fork, US',
                    'user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15;'
                                + 'rv:109.0) Gecko/20100101 Firefox/117.0'
                }
            ],
            'authenticator_assurance_level': f'aal{i%2 + 1}',
            'identity': {
                'id': str(uuid.uuid4()),
                'traits': {
                    'email': f'testemail{i}@test.com',
                    'name': {
                        'first': 'Test',
                        'last': f'User${i}'
                    }
                },
                'verifiable_addresses': [{'verified': True}]
            }
        }
    } for i in range(1, 4)
]
# First payload is AAL2, second is AAL1, third is AAL2, etc.

tokens = [
    jwt.encode(
        {**payload, 'exp': 9999999999},
        key=private_key,
        algorithm='RS256',
    )
    for payload in session_payloads
]


class ViewTestsMixin(TestCase):
    '''Mixing for view tests which provides a client and user.
    Additionally, the OATHKEEPER_PUBLIC_KEY is overrriden and
    a key pair is provided for encoding a JWT header during testing
    that will pass the auth middleware.'''

    def setUp(self):
        '''Create user and client'''

        self.aal2_payload = session_payloads[0]
        self.aal1_payload = session_payloads[1]

        self.user = get_user_model().objects.create_user(
            id=self.aal1_payload['session']['identity']['id']
        )

        Customer.objects.create(
            user=self.user,
            id=uuid.uuid4(),
            subscription_status='active',
            period_end=1794475549,
        )
        self.aal2_user = get_user_model().objects.create_user(
            id=self.aal2_payload['session']['identity']['id']
        )
        Customer.objects.create(
            user=self.aal2_user,
            id=uuid.uuid4(),
            subscription_status='active',
            period_end=1794475549
        )

        self.createClients()

    def createClients(self):
        self.client = APIClient(enforce_csrf_checks=False)
        self.client.defaults['HTTP_AUTHORIZATION'] = 'bearer {}'.format(tokens[1])

        self.aal2_client = APIClient(enforce_csrf_checks=False)
        self.aal2_client.defaults['HTTP_AUTHORIZATION'] = 'bearer {}'.format(tokens[0])

        self.unauthed_client = APIClient(enforce_csrf_checks=False)

        self.client1_device = self.aal1_payload['session']['devices'][0]
        self.aal2_client_device = self.aal2_payload['session']['devices'][0]

        for client in [self.client, self.aal2_client]:
            self.add_device(client)

    def add_device(self, client):
        '''Test that a device is created when a user logs in'''
        response = client.post(reverse('devices-list'))
        self.assertEqual(response.status_code, 200)
