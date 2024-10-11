from unittest.mock import patch, Mock
from django.urls import reverse
from restapi.tests.mixins import ViewTestsMixin
import plaid

from financials.views.transactions import plaid_client


class TestLiabilities(ViewTestsMixin):

    @patch.object(plaid_client, 'liabilities_get')
    def test_fetch_liabilities_data(self, mock_liabilities_get):
        mock_liabilities_get.side_effect = plaid.ApiException(
            status=400,
            reason="Bad Request",
            http_resp=Mock(data='{"error_code": "PRODUCTS_NOT_SUPPORTED"}')
        )

        response = self.client.get(reverse('liabilities'))
        self.assertEqual(response.status_code, 200)
