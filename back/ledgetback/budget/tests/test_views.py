from ledgetback.tests.mixins import ViewTestsMixin
from django.urls import reverse

from ..models import (
    BudgetCategory
)


class ViewTests(ViewTestsMixin):

    def test_category_creation(self):
        response = self.client.post(reverse('create_category'), {
            'name': 'Test Category',
            'emoji': '🤑',
            'period': 'monthly',
            'limit_amount': 10000,
            'alerts': [
                {'percent_amount': 50},
                {'percent_amount': 75}
            ]
        })

        self.assertEqual(response.status_code, 200)
        category = BudgetCategory.objects.filter(user=self.user) \
                                         .select_related('alerts').first()

        # Check if the category was created
        self.assertIsNotNone(category)

        # Check if the alerts were created
        alerts = category.alerts.all()
        self.assertEqual(alerts.count(), 2)

        self.assertEqual(category.name, 'Test Category')
        self.assertEqual(category.emoji, '🤑')
        self.assertEqual(category.period, 'monthly')
        self.assertEqual(category.limit_amount, 100)

        alert_percentages = [alert.percent_amount for alert in alerts]
        self.assertIn(50, alert_percentages)
        self.assertIn(75, alert_percentages)

        category.delete()

    def test_bulk_category_creation(self):
        pass

    def test_bulk_bill_creation(self):
        pass
