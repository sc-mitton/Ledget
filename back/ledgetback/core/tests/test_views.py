import json
from unittest import skip # noqa
from unittest.mock import patch, MagicMock
from ledgetback.tests.utils import timeit # noqa

from ledgetback.tests.mixins import ViewTestsMixin

from django.urls import reverse


class CoreViewTests(ViewTestsMixin):

    def test_user_update(self):
        pass

    @patch('core.views.user.stripe.Subscription.list')
    def test_user_me(self, mock_subscription_list):
        mock_subscription = MagicMock()
        mock_subscription.current_period_end = 123456789

        mock_plan = MagicMock()
        mock_plan.nickname = 'test'
        mock_plan.amount = 1000

        mock_subscription.plan = mock_plan
        mock_subscription_list.return_value.data = [mock_subscription]

        response = self.client.get(reverse('user_me'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(str(response.data['id']), str(self.user.id))

        mock_subscription_list.assert_called_once_with(
            customer=str(self.user.customer.id)
        )

    def test_update_onboarding_status(self):
        response = self.client.patch(
            reverse('update_user', kwargs={'id': self.user.id}),
            data=json.dumps({"is_onboarded": True}),
            content_type='application/json'
        )

        self.user.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.is_onboarded, True)

    def test_user_object_update_permissions(self):
        response = self.client2.patch(
            reverse('update_user', kwargs={'id': self.user.id}),
            data=json.dumps({"is_onboarded": True}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)
