from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.conf import settings

import uuid
import jwt
from core.models import Customer

public_key = settings.OATHKEEPER_PUBLIC_KEY
private_key = settings.OATHKEEPER_PRIVATE_KEY

payload = {
    'session': {
        'identity': {
            'id': str(uuid.uuid4()),
            'traits': {
                'email': 'testemail@test.com',
                'name': {
                    'first': 'Test',
                    'last': 'User'
                }
            },
            'verifiable_addresses': [
                {
                    'verified': True,
                }
            ]
        }
    }
}

token = jwt.encode(
    {**payload, 'exp': 9999999999},
    key=private_key,
    algorithm='RS256',
)


class ViewTestsMixin(TestCase):
    '''Mixing for view tests which provides a client and user.
    Additionally, the OATHKEEPER_PUBLIC_KEY is overrriden and
    a key pair is provided for encoding a JWT header during testing
    that will pass the auth middleware.'''

    def setUp(self):
        '''Create user and client'''

        self.client = APIClient()
        self.client.defaults['HTTP_AUTHORIZATION'] = 'bearer {}'.format(token)
        self.user = get_user_model().objects.create_user(
            id=payload['session']['identity']['id']
        )
        Customer.objects.create(
            user=self.user,
            id=uuid.uuid4(),
            subscription_status='active',
            period_end=9999999999
        )
