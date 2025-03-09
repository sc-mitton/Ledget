from unittest.mock import patch, Mock, MagicMock
import json


from django.urls import reverse
from django.conf import settings

from restapi.tests.mixins import ViewTestsMixin
from core.models import Feedback
from core.views.service import stripe as service_stripe
from restapi.permissions.objects import stripe as objects_stripe
from restapi.permissions.auth import stripe as auth_stripe

TEST_SUBSCRIPTION_ID = 'test_subscription_id'
TEST_SUBSCRIPTION_ITEM_ID = 'test_subscription_item_id'


class MockStripeSubscription(MagicMock):

    def __getattr__(self, name):
        if name == 'plan':
            return MockStripeSubscription()
        else:
            return 'mocked'


class TestServiceViews(ViewTestsMixin):

    @patch.object(service_stripe.Subscription, 'list')
    def test_get_subscription(self, mock_subscription_list):
        mock_subscription_list.return_value = \
            self._get_mock_subscription_list_active_response()

        # Get subscription
        response = self.client.get(reverse('subscription'))
        subscription = response.data
        self.assertIsNotNone(subscription)

    @patch.object(objects_stripe.Subscription, 'list')
    @patch.object(service_stripe.Subscription, 'modify')
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

    @patch.object(objects_stripe.Subscription, 'list')
    @patch.object(service_stripe.Subscription, 'modify')
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
    @patch.object(service_stripe.SubscriptionItem, 'modify')
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
        path = settings.TEST_DATA_DIR / 'responses' / 'mock_stripe_response.json'
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

    def test_get_prices(self):
        response = self.client.get(reverse('prices'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    @patch.object(auth_stripe.Subscription, 'list')
    @patch.object(service_stripe.Subscription, 'create')
    def test_create_stripe_subscription(self, mock_subscription_create,
                                        mock_subscription_list):

        mock_subscription_list.return_value = Mock(data=[])
        mock_subscription_create.return_value = \
            Mock(pending_setup_intent=Mock(client_secret='test_client_secret'))

        response = self.client.post(
            reverse('subscription'),
            json.dumps({'price_id': 'test_price_id'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)

    def test_get_default_payment_method(self):
        response = self.client.get(reverse('default-payment-method'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def test_get_next_invoice(self):
        response = self.client.get(reverse('next-invoice'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    @patch.object(service_stripe.Customer, 'create')
    def test_create_customer(self, mock_customer_create):
        mock_customer_create.return_value = Mock(id='test_customer_id')

        self.user.account.customer = None
        self.user.account.save()
        self.user.customer.delete()

        response = self.client.post(reverse('customer'))
        self.assertEqual(response.status_code, 200)
        mock_customer_create.assert_called_once()
