from django.urls import reverse
from unittest.mock import patch
from django.conf import settings
import json

from restapi.tests.mixins import ViewTestsMixin
from financials.views.investments import plaid_client


class TextInvestmentsViews(ViewTestsMixin):

    def setUp(self):
        super().setUp()

        holdings_response_file = \
            settings.TEST_DATA_DIR / 'responses' / 'mock_investments_holdings_get.json'
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
        mock_investments_transactions_get,
        mock_investments_holdings_get
    ):
        mock_investments_transactions_get.return_value = self.transactions_get_response
        mock_investments_holdings_get.return_value = self.holdings_get_response

        response = self.client.get(reverse('investments'))
        self.assertEqual(response.status_code, 200)
