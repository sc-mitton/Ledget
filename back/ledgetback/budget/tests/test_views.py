import json
from unittest import skip # noqa

from ledgetback.tests.mixins import ViewTestsMixin
from ledgetback.tests.utils import timeit # noqa
from django.urls import reverse
from ..models import (
    Category,
    Bill
)
from financials.models import Account
from .data import (
    single_category_creation_payload,
    multiple_category_creation_payload,
    single_bill_creation_payload,
    multiple_bill_creation_payload
)


class BudgetViewTestObjectCreations(ViewTestsMixin):
    fixtures = ['reminders_fixture.json']

    @timeit
    def test_category_creation(self):
        payload = single_category_creation_payload

        response = self.client.post(
            reverse('categories-list'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        category = Category.objects.filter(usercategory__user=self.user).first()
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
            reverse('categories-list'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        categories = Category.objects.filter(usercategory__user=self.user)
        self.assertEqual(categories.count(), len(payload))

        i = 0
        for category in categories:
            self.assertEqual(
                category.alerts.count(),
                len(payload[i]['alerts'])
            )
            i += 1

    @timeit
    def test_bill_creation(self):
        payload = single_bill_creation_payload
        response = self.client.post(
            reverse('bills-list'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        bill = Bill.objects.filter(userbill__user=self.user).first()

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
            reverse('bills-list'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        bills = Bill.objects.filter(userbill__user=self.user)
        self.assertEqual(bills.count(), len(payload))

        i = 0
        for bill in bills:
            self.assertEqual(
                bill.reminders.count(),
                len(payload[i]['reminders'])
            )
            i += 1


class BudgetViewTestRetreval(ViewTestsMixin):
    fixtures = [
        'transaction_fixture.json',
        'categorie_fixture.json',
        'bill_fixture.json',
        'reminder_fixture.json',
        'plaid_item_fixture.json',
        'account_fixture.json',
        'institution_fixture.json',
        'user_fixture.json'
    ]

    def setUp(self):
        '''
        Add self.user to all categories, bills, and accounts
        '''
        super().setUp()

        accounts = Account.objects.all()
        categories = Category.objects.all()
        bills = Bill.objects.all()
        self.user.accounts.add(*accounts)
        self.user.bills.add(*bills)
        self.user.categories.add(*categories)

    @timeit
    def test_get_bills(self):
        response = self.client.get(reverse('bills-list'))
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data.__len__(), 0)

    @timeit
    def test_get_categories(self):
        response = self.client.get(reverse('categories-list'))
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data.__len__(), 0)

    @timeit
    def test_get_timesliced_categories(self):
        month = 10
        year = 2023
        response = self.client.get(
            reverse('categories-list'),
            {'month': month, 'year': year}
        )
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data.__len__(), 0)
