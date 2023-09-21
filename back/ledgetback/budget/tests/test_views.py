import json
from unittest import skip # noqa

from ledgetback.tests.mixins import ViewTestsMixin
from ledgetback.tests.utils import timeit # noqa
from django.urls import reverse
from ..models import (
    Category,
    Bill
)
from .data import (
    single_category_creation_payload,
    multiple_category_creation_payload,
    single_bill_creation_payload,
    multiple_bill_creation_payload
)


class BudgetViewTests(ViewTestsMixin):

    @timeit
    def test_category_creation(self):
        payload = single_category_creation_payload

        response = self.client.post(
            reverse('create_category'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        category = Category.objects.filter(user=self.user).first()
        self.assertIsNotNone(category)
        self.assertEqual(category.name, payload['name'])
        self.assertEqual(category.emoji, payload['emoji'])
        self.assertEqual(category.period, payload['period'])
        self.assertEqual(category.limit_amount, payload['limit_amount'])

        alerts = category.alerts.all()
        self.assertEqual(alerts.count(), payload['alerts'].__len__())

        category.delete()

    @timeit
    def test_bulk_category_creation(self):
        payload = multiple_category_creation_payload

        response = self.client.post(
            reverse('create_category'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        categories = Category.objects.filter(user=self.user)
        self.assertEqual(categories.count(), len(payload))

        i = 0
        for category in categories:
            self.assertEqual(str(category.user.id), self.user.id)
            self.assertEqual(
                category.alerts.count(),
                len(payload[i]['alerts'])
            )
            i += 1

    @timeit
    def test_bill_creation(self):
        payload = single_bill_creation_payload

        response = self.client.post(
            reverse('create_bill'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        bill = Bill.objects.filter(user=self.user).first()
        self.assertIsNotNone(bill)
        self.assertEqual(bill.name, payload['name'])
        self.assertEqual(bill.emoji, payload['emoji'])
        self.assertEqual(bill.period, payload['period'])
        self.assertEqual(bill.day, payload['day'])

        reminders = bill.reminders.all()
        self.assertEqual(reminders.count(), payload['reminders'].__len__())

        bill.delete()

    @timeit
    def test_bulk_bill_creation(self):
        payload = multiple_bill_creation_payload

        response = self.client.post(
            reverse('create_bill'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        bills = Bill.objects.filter(user=self.user)
        self.assertEqual(bills.count(), len(payload))

        i = 0
        for bill in bills:
            self.assertEqual(str(bill.user.id), self.user.id)
            self.assertEqual(
                bill.reminders.count(),
                len(payload[i]['reminders'])
            )
            i += 1

    @timeit
    def test_get_bills(self):
        self.test_bulk_bill_creation()
        response = self.client.get(reverse('get_bills'))
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data.__len__(), 0)

    @timeit
    def test_get_categories(self):
        self.test_bulk_category_creation()
        response = self.client.get(reverse('get_categories'))
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data.__len__(), 0)

    @timeit
    def test_get_suggested_bills(self):
        pass
