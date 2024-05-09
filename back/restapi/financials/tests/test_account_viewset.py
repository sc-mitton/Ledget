from unittest.mock import patch, MagicMock

from django.urls import reverse

from restapi.tests.mixins import ViewTestsMixin
from financials.views.account import plaid_client
from financials.models import Account


class TestPlaidItemView(ViewTestsMixin):

    @patch.object(plaid_client, 'accounts_get')
    def test_get_account_balance(self, mock_accounts_get):
        mock_accounts_get.return_value = \
            self._get_mock_accuonts_get_return_response()

        response = self.client.get(reverse('account'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def _get_mock_accuonts_get_return_response(self):
        accounts = Account.objects.filter(useraccount__user_id=self.user.id)
        to_dict = {
            'accounts': [
                {
                    'account_id': account.plaid_item.access_token,
                    'balances': {
                        'current': 1000
                    }
                }
                for account in accounts
            ]
        }

        return MagicMock(to_dict=MagicMock(return_value=to_dict))

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

        response = self.client.patch(reverse('account'), payload, format='json')
        self.assertEqual(response.status_code, 200)

        accounts = Account.objects.filter(useraccount__user_id=self.user.id)
        self.assertEqual(accounts[0].id, payload[-1]['account'])
