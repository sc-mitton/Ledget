from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from unittest import skip # noqa
from datetime import datetime

from core.models import (
    Price,
    Subscription
)


class TestModels(TestCase):
    fixtures = ['prices.json', 'users.json', 'customers.json']

    def setUp(self) -> None:
        self.testuser1 = get_user_model().objects.filter(
            email='testcustomer1@example.com'
        ).first()
        self.testuser2 = get_user_model().objects.filter(
            email='testcustomer2@example.com'
        ).first()

    def test_multiple_subscriptions_error(self):
        """Test that a user can only have one ongoing subscription
        at a time."""
        price1 = Price.objects.all().first()
        price2 = Price.objects.all().last()

        Subscription.objects.create(
            id='randomchar1',
            price=price1,
            customer=self.testuser1.customer,
            created=int(datetime.now().timestamp()),
            trial_start=int(datetime.now().timestamp()),
        ).save()

        self.assertRaises(
            ValidationError,
            Subscription.objects.create,
            id='randomchar2',
            price=price2,
            customer=self.testuser1.customer,
            created=int(datetime.now().timestamp()),
            trial_start=int(datetime.now().timestamp()),
        )
        uncanceled_subscriptions = \
            Subscription.objects.filter(customer=self.testuser1.customer) \
                                .exclude(status__in=['canceled'])

        self.assertEqual(uncanceled_subscriptions.count(), 1)
