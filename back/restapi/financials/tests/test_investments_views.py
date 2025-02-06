from datetime import timedelta
from unittest.mock import patch, MagicMock

from django.urls import reverse
from django.conf import settings
from django.db.models import Min
import json

from restapi.tests.mixins import ViewTestsMixin
from financials.views.investments import plaid_client
from financials.models import AccountBalance


class TestInvestmentsViews(ViewTestsMixin):

    def setUp(self):
        super().setUp()

        self.set_user_on_all_plaid_items(self.user)
        holdings_response_file = \
            settings.TEST_DATA_DIR \
            / 'responses' \
            / 'mock_investments_holdings_get.json'
        with open(holdings_response_file, 'r') as f:
            self.holdings_get_response = json.load(f)

        transactions_response_file = \
            settings.TEST_DATA_DIR  \
            / 'responses' \
            / 'mock_investments_transactions_get.json'
        with open(transactions_response_file, 'r') as f:
            self.transactions_get_response = json.load(f)

    @patch.object(plaid_client, 'investments_transactions_get')
    @patch.object(plaid_client, 'investments_holdings_get')
    def test_list_investments(
        self,
        mock_investments_holdings_get,
        mock_investments_transactions_get
    ):
        mock_investments_transactions_get.return_value = MagicMock(
            to_dict=MagicMock(return_value=self.transactions_get_response))
        mock_investments_holdings_get.return_value = MagicMock(
            to_dict=MagicMock(return_value=self.holdings_get_response))

        response = self.client.get(reverse('investments'))

        self.assertEqual(response.status_code, 200)

    def test_get_investment_history(self):

        start = AccountBalance.objects.all().aggregate(Min('date'))['date__min']
        end = start + timedelta(days=30)
        start = start.strftime('%Y-%m-%d')
        end = end.strftime('%Y-%m-%d')

        response = self.client.get(
            reverse('investments-balance-history'),
            kwargs={'start': start, 'end': end}
        )

        self.assertEqual(response.status_code, 200)
