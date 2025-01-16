from datetime import datetime, UTC

from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.conf import settings
from django.urls import reverse
from django.test import modify_settings
from django.utils import timezone

import uuid
import jwt
from core.models import Customer, Account
from financials.models import (
    UserAccount,
    Account as FinancialAccount,
    PlaidItem
)
from budget.models import UserCategory, UserBill, Category, Bill


public_key = settings.OATHKEEPER_PUBLIC_KEY
private_key = settings.OATHKEEPER_PRIVATE_KEY
current_time = datetime.now(UTC).isoformat(timespec='milliseconds') + 'Z'

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
            'id': str(uuid.uuid4()),
            'authenticator_assurance_level': f'aal{i % 2 + 1}',
            'authentication_methods': [
                {
                    "aal": f"aal{i % 2 + 1}",
                    "completed_at": datetime.now(UTC).strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                    "method": "password"
                }
            ],
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


def encode_jwt(payload):
    return jwt.encode(
            {**payload, 'exp': 9999999999},
            key=private_key,
            algorithm='RS256',
        )


tokens = [
    encode_jwt(payload)
    for payload in session_payloads
]


@modify_settings(MIDDLEWARE={
    'remove': 'restapi.middleware.CustomCsrfMiddleware'
})
class ViewTestsMixin(TestCase):
    '''Mixing for view tests which provides a client and user.
    Additionally, the OATHKEEPER_PUBLIC_KEY is overrriden and
    a key pair is provided for encoding a JWT header during testing
    that will pass the auth middleware.'''
    fixtures = [
        'transaction_fixture.json',
        'category_fixture.json',
        'bill_fixture.json',
        'reminder_fixture.json',
        'plaid_item_fixture.json',
        'account_fixture.json',
        'institution_fixture.json',
        'core_account_fixture.json',
        'customer_fixture.json',
        'user_fixture.json',
        'settings_fixture.json',
        'user_account_fixture.json',
        'user_category_fixture.json',
        'user_bill_fixture.json',
        'account_balance_fixture.json'
    ]

    def setUp(self):
        '''Create user and client'''

        self.aal2_payload = session_payloads[0]
        self.aal1_payload = session_payloads[1]

        self.setup_main_test_user()
        self.setup_secondary_aal2_user()

        self.create_clients()
        self.update_period_end(self.user)
        self.update_period_end(self.aal2_user)

    def update_period_end(self, user):
        user.customer.period_end = timezone.now().timestamp()
        user.customer.save()

    def setup_secondary_aal2_user(self):
        # AAL2 user
        account_for_aal2_user = Account.objects.create()
        self.aal2_user = get_user_model().objects.create_user(
            id=self.aal2_payload['session']['identity']['id'],
            account=account_for_aal2_user
        )
        self.aal2_user.settings.mfa_method = 'totp'
        self.aal2_user.settings.save()
        customer_for_aal2_user = Customer.objects.create(
            user=self.aal2_user,
            id=uuid.uuid4(),
            subscription_status='active',
            period_end=1794475549
        )
        account_for_aal2_user.customer = customer_for_aal2_user
        account_for_aal2_user.save()

    def setup_main_test_user(self):
        new_account = Account.objects.create()
        self.user = get_user_model().objects.create_user(
            id=self.aal1_payload['session']['identity']['id'],
            account=new_account
        )

        # Add the existing stripe customer to the user, since it
        # has a real stripe customer id
        customer = Customer.objects.first()
        customer.user = self.user

        # Remove the customer from the account it was previously on
        account = Account.objects.filter(customer=customer).first()
        account.customer = None
        new_account.customer = customer

        account.save()
        customer.save()
        new_account.save()

        self.add_user_to_financial_accounts(self.user)

    def add_user_to_financial_accounts(self, user):
        accounts = FinancialAccount.objects.all()
        useraccounts = []
        for account in accounts:
            useraccounts.append(UserAccount(
                user=user,
                account=account
            ))
        UserAccount.objects.bulk_create(useraccounts)

    def set_user_on_all_plaid_items(self, user):
        items = PlaidItem.objects.all()
        for item in items:
            item.user = user
            item.save()

    def add_user_to_budget_categories(self, user):
        categories = Category.objects.all()
        usercategories = []
        for category in categories:
            usercategories.append(UserCategory(
                user=user,
                category=category
            ))
        UserCategory.objects.all().delete()
        UserCategory.objects.bulk_create(usercategories)

    def add_user_to_budget_bills(self, user):
        bills = Bill.objects.all()
        userbills = []
        for bill in bills:
            userbills.append(UserBill(
                user=user,
                bill=bill
            ))
        UserBill.objects.all().delete()
        UserBill.objects.bulk_create(userbills)

    def create_clients(self):
        self.client = APIClient()
        self.client.defaults[settings.OATHKEEPER_JWT_HEADER] = '{} {}'.format(
            settings.OATHKEEPER_JWT_AUTH_SCHEME, tokens[1])

        self.aal2_client = APIClient()
        self.aal2_client.defaults[settings.OATHKEEPER_JWT_HEADER] = '{} {}'.format(
            settings.OATHKEEPER_JWT_AUTH_SCHEME, tokens[0])

        self.unauthed_client = APIClient()

        self.client1_device = self.aal1_payload['session']['devices'][0]
        self.aal2_client_device = self.aal2_payload['session']['devices'][0]

        for client in [self.client, self.aal2_client]:
            self.add_device(client)

    def add_device(self, client):
        '''Test that a device is created when a user logs in'''
        response = client.post(reverse('devices'))
        self.assertEqual(response.status_code, 200)
