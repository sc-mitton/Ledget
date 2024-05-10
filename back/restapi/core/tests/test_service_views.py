from unittest.mock import patch, Mock, MagicMock
import json
from pathlib import Path

from django.urls import reverse

from restapi.tests.mixins import ViewTestsMixin
from core.models import Feedback
from core.views.service import stripe as core_stripe
from restapi.permissions.objects import stripe as restapi_stripe

TEST_SUBSCRIPTION_ID = 'test_subscription_id'
TEST_SUBSCRIPTION_ITEM_ID = 'test_subscription_item_id'


class MockStripeSubscription(MagicMock):

    def __getattr__(self, name):
        if name == 'plan':
            return MockStripeSubscription()
        else:
            return 'mocked'


class TestServiceViews(ViewTestsMixin):

    @patch.object(core_stripe.Subscription, 'list')
    def test_get_subscription(self, mock_subscription_list):
        mock_subscription_list.return_value = \
            self._get_mock_subscription_list_active_response()

        # Get subscription
        response = self.client.get(reverse('subscription'))
        subscription = response.data
        self.assertIsNotNone(subscription)

    @patch.object(restapi_stripe.Subscription, 'list')
    @patch.object(core_stripe.Subscription, 'modify')
    def test_cancel_subscription(self, mock_subscription_modify,
                                 mock_subscription_list):

        mock_subscription_list.return_value = \
            self._get_mock_subscription_list_response()

        # Cancel subscription
        response = self.client.delete(
            reverse('delete-restart-subscription',
                    kwargs={'id': TEST_SUBSCRIPTION_ID}),
            data=json.dumps({
                'cancel_at_period_end': True,
                'feedback': 'test feedback',
                'cancelation_reason': 'test reason'
            }),
            content_type='application/json',
        )

        # Checks
        self.assertEqual(response.status_code, 200)
        mock_subscription_modify.assert_called_once()
        self.assertGreater(Feedback.objects.filter(user=self.user).count(), 0)

    @patch.object(restapi_stripe.Subscription, 'list')
    @patch.object(core_stripe.Subscription, 'modify')
    def test_uncancel_subscription(self, mock_subscription_modify,
                                   mock_subscription_list):

        mock_subscription_list.return_value = \
            self._get_mock_subscription_list_response()

        response = self.client.patch(
            reverse(
                'delete-restart-subscription',
                kwargs={'id': TEST_SUBSCRIPTION_ID}
            ),
            json.dumps({'cancel_at_period_end': False}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        mock_subscription_modify.assert_called_once()

    @patch('core.views.service.get_current_subscription_id')
    @patch.object(core_stripe.SubscriptionItem, 'modify')
    def test_changing_subscription(self, mock_subscription_modify,
                                   mock_get_current_subscription_id):
        mock_get_current_subscription_id.return_value = TEST_SUBSCRIPTION_ITEM_ID

        response = self.client.put(
            reverse('subscription-item'),
            json.dumps({'price': 'test_price_id'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        mock_subscription_modify.assert_called_once()

    def _get_stripe_response_data(self):
        path = Path(__file__).resolve().parents[0] / 'mock_stripe_response.json'
        with open(path, 'r') as f:
            data = json.loads(f.read())

        return data

    def _get_mock_subscription_list_active_response(self):
        data = self._get_stripe_response_data()
        mmock = MagicMock()
        mmock.data = [
            MockStripeSubscription(
                status=s['status'],
                id=['id'],
            )
            for s in data['data']
        ]
        mmock.__iter__.return_value = mmock.data
        return mmock

    def _get_mock_subscription_list_response(self):
        data = self._get_stripe_response_data()

        return Mock(
            data=[
                Mock(status=s['status'], id=TEST_SUBSCRIPTION_ID)
                for s in data['data']
            ]
        )
