from unittest.mock import patch, MagicMock

from django.urls import reverse

from restapi.tests.mixins import ViewTestsMixin
from financials.views.account import plaid_client
from financials.models import Account


class TestPlaidItemView(ViewTestsMixin):

    @patch.object(plaid_client, 'accounts_get')
    def test_get_account_balance(self, mock_accounts_get):
        mock_accounts_get.return_value = \
            self._get_mock_accounts_get_return_response()

        response = self.client.get(reverse('accounts-list'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def _get_mock_accounts_get_return_response(self):
        accounts = Account.objects.filter(useraccount__user_id=self.user.id)
        return_value = {
            'accounts': [
                {
                    'account_id': account.id,
                    'balances': {
                        'current': 1000
                    },
                    'type': account.type,
                    'subtype': account.subtype
                }
                for account in accounts
            ]
        }

        return MagicMock(to_dict=MagicMock(return_value=return_value))

    def test_update_account_order(self):
        '''
        Test the reordering of accounts endpoint by reversing the order of the
        accounts and checking if the order has been updated in the database
        '''

        accounts = Account.objects.filter(useraccount__user_id=self.user.id)
        payload = [
            {
                'account': account.id,
                'order': index
            }
            for index, account in enumerate(accounts)
        ]
        payload.reverse()

        response = self.client.patch(reverse('accounts-list'), payload, format='json')
        self.assertEqual(response.status_code, 200)

    def test_get_account_balance_trend(self):
        '''
        Test the balance trend endpoint by checking if the response contains
        the expected keys
        '''

        response = self.client.get(reverse('accounts-balance-trend'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('days', response.data)
        self.assertIn('trends', response.data)

    def test_get_breakdown_history(self):
        '''
        Test the breakdown history endpoint returns a 200 status code
        '''

        response = self.client.get(reverse('accounts-breakdown-history'))
        self.assertEqual(response.status_code, 200)
