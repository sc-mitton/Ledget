import json
from unittest import skip # noqa

from ledgetback.tests.mixins import ViewTestsMixin
from ledgetback.tests.utils import timeit # noqa
from django.urls import reverse
from ..models import (
    Category,
    Bill,
    Reminder
)
from financials.models import Account
from .data import (
    single_category_creation_payload,
    multiple_category_creation_payload,
    single_bill_creation_payload,
    multiple_bill_creation_payload
)


class BudgetViewTestObjectCreations(ViewTestsMixin):
    fixtures = ['reminder_fixture.json']

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


class BudgetViewTestRetrevalUpdate(ViewTestsMixin):
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

    def test_update_bill(self):
        '''
        Test updating a view values and adding some reminders for a bill
        '''

        bill = Bill.objects.prefetch_related('reminders') \
                           .filter(removed_on__isnull=True).first()
        reminders = Reminder.objects.all()[:2]

        payload = {
            'name': 'New Name',
            'upper_amount': bill.upper_amount + 100,
            'reminders': [{'id': str(reminder.id)} for reminder in reminders]
        }
        response = self.client.put(
            reverse('bills-detail', kwargs={'pk': bill.id}),
            data=json.dumps(payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data['name'], bill.name)
        self.assertNotEqual(response.data['upper_amount'], bill.upper_amount)
        bill.refresh_from_db()
        self.assertEqual(bill.reminders.count(), len(reminders))

    def test_update_category(self):
        '''
        Test updating a view values and adding some alerts for a category
        '''

        category = Category.objects.prefetch_related('alerts') \
                                   .filter(removed_on__isnull=True).first()
        alerts = category.alerts.all()[:2]

        payload = {
            'name': 'New Name',
            'limit_amount': category.limit_amount + 100,
            'alerts': [{'id': str(alert.id)} for alert in alerts]
        }
        response = self.client.put(
            reverse('categories-detail', kwargs={'pk': category.id}),
            data=json.dumps(payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data['name'], category.name)
        self.assertNotEqual(response.data['limit_amount'], category.limit_amount)
        category.refresh_from_db()
        self.assertEqual(category.alerts.count(), len(alerts))

    def test_get_spending_history(self):
        '''
        Test the category endpoint that returns the spending summary for each
        month until the user started. The response will probably return nothing
        since the db is empty, but we still want to test the endpoint to make sure
        nothing breaks.
        '''

        category = Category.objects.filter(usercategory__user=self.user).first()

        response = self.client.get(
            reverse('categories-spending-history', kwargs={'pk': category.id})
        )
        self.assertEqual(response.status_code, 200)
