import json
from unittest import skip # noqa

from ledgetback.tests.mixins import ViewTestsMixin
from ledgetback.tests.utils import timeit # noqa
from django.urls import reverse
from ..models import (
    Category
)
from .data import (
    multiple_category_creation_payload,
    single_category_creation_payload
)


class ViewTests(ViewTestsMixin):

    def test_category_creation(self):
        payload = single_category_creation_payload

        response = self.client.post(
            reverse('create_category'),
            data=json.dumps(payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 201)
        category = Category.objects.filter(user=self.user).first()

        # Check if the category was created
        self.assertIsNotNone(category)

        # Check if the alerts were created
        alerts = category.alerts.all()
        self.assertEqual(alerts.count(), 2)

        self.assertEqual(category.name, payload['name'])
        self.assertEqual(category.emoji, payload['emoji'])
        self.assertEqual(category.period, payload['period'])
        self.assertEqual(category.limit_amount, payload['limit_amount'])

        alert_percentages = [alert.percent_amount for alert in alerts]
        self.assertIn(50, alert_percentages)
        self.assertIn(75, alert_percentages)

        category.delete()

    def test_bulk_category_creation(self):
        response = self.client.post(
            reverse('create_category'),
            data=json.dumps(multiple_category_creation_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        categories = Category.objects.filter(user=self.user)
        self.assertEqual(
            categories.count(),
            len(multiple_category_creation_payload)
        )

        for category in categories:
            self.assertEqual(str(category.user.id), self.user.id)
            self.assertEqual(
                category.alerts.count(),
                len(multiple_category_creation_payload[0]['alerts'])
            )

    def test_bulk_bill_creation(self):
        pass
