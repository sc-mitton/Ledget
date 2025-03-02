import json
from unittest import skip  # noqa
from datetime import datetime, timedelta, timezone
import time

from restapi.tests.mixins import ViewTestsMixin
from restapi.tests.utils import timeit  # noqa
from ..models import (
    Category,
    Bill,
    Reminder
)
from restapi.utils import reverse
from financials.models import Account, Transaction, TransactionCategory


class BudgetViewTestObjectCreations(ViewTestsMixin):

    @timeit
    def test_category_creation(self):
        payload = {
            'name': 'Test Category',
            'emoji': '🤑',
            'period': 'month',
            'limit_amount': 10000,
            'alerts': [
                {'percent_amount': 50},
                {'percent_amount': 75}
            ]
        }

        response = self.client.post(
            reverse('categories-list'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        category = Category.objects.filter(
            usercategory__user=self.user).first()
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
        payload = [
            {
                'name': f'Test Category {i}',
                'emoji': '🤑',
                'period': 'month',
                'limit_amount': 10000,
                'alerts': [
                    {'percent_amount': 50},
                    {'percent_amount': 75}
                ]
            }
            for i in range(1, 20)
        ]

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
        reminders = Reminder.objects.all()
        number_of_reminders = reminders.count()
        payload = {
            'name': 'Test Bill',
            'emoji': '🤑',
            'period': 'month',
            'day': 1,
            'lower_amount': 1000,
            'upper_amount': 10000,
            'reminders': [
                {'id': str(reminder.id)
                    for reminder in reminders[:number_of_reminders // 2]}
            ]
        }

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
        self.assertEqual(reminders.count(), len(payload.get('reminders', [])))

        bill.delete()

    @timeit
    def test_bulk_bill_creation(self):
        reminders = Reminder.objects.all()
        number_of_reminders = reminders.count()
        payload = [
            {
                'name': f'Test Bill {i}',
                'emoji': '🤑',
                'period': 'month',
                'day': 1,
                'lower_amount': 1000,
                'upper_amount': 10000,
                'reminders': [
                    {'id': str(reminder.id)
                        for reminder in reminders[:number_of_reminders // 2]}
                ]
            }
            for i in range(1, 20)
        ]

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
                len(payload[i].get('reminders', []))
            )
            i += 1

    def test_reordering_categories(self):
        categories = Category.objects.all()
        self.user.categories.add(*categories)

        payload = [str(c.id) for c in categories[::-1]]
        response = self.client.post(
            reverse('categories-order'),
            json.dumps(payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 204)
        reordered_categories = Category.objects \
                                       .filter(usercategory__user=self.user) \
                                       .order_by('usercategory__order')

        self.assertEqual(
            categories[len(categories) - 1] == reordered_categories[0],
            True)

    def test_create_bill_reminder(self):
        bill = Bill.objects.filter(removed_on__isnull=True).first()
        payload = {
            'offset': 5,
            'period': 'day',
            'bill': str(bill.id)
        }
        response = self.client.post(
            reverse('reminders'),
            json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        bill.refresh_from_db()
        reminder = next(
            (r for r in bill.reminders.all() if r.offset == 5), None)
        self.assertIsNotNone(reminder)


class BudgetViewTestRetrevalUpdate(ViewTestsMixin):

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

    def test_get_specific_month_year_bills(self):
        month = 10
        year = 2023
        response = self.client.get(
            reverse('bills-list', query_kwargs={'month': month, 'year': year}))
        self.assertEqual(response.status_code, 200)

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
            'reminders': [{'id': str(reminder.id)} for reminder in reminders]
        }
        response = self.client.patch(
            reverse('bills-detail', kwargs={'pk': bill.id}),
            data=json.dumps(payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data['name'], bill.name)
        bill.refresh_from_db()
        self.assertEqual(bill.reminders.count(), len(reminders))

    @timeit
    def test_update_category(self):
        '''
        Test updating a view values and adding some alerts for a category
        This is a patch method
        '''

        category = Category.objects.prefetch_related('alerts') \
                                   .filter(removed_on__isnull=True).first()
        alerts = category.alerts.all()[:2]

        payload = {
            'name': 'New Name',
            'alerts': [{'id': str(alert.id)} for alert in alerts],
        }
        payload['alerts'].append({'percent_amount': 50})  # Add a new alert

        response = self.client.patch(
            reverse('categories-detail', kwargs={'pk': category.id}),
            data=json.dumps(payload),
            content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data['name'], category.name)
        category.refresh_from_db()
        self.assertEqual(category.alerts.count(), len(payload['alerts']))

    def test_update_category_limit_amount(self):
        category = Category.objects.filter(
            removed_on__isnull=True, limit_amount__isnull=False
        ).prefetch_related('alerts').first()

        payload = {
            'name': category.name,
            'emoji': category.emoji,
            'period': category.period,
            'alerts': [
                {'id': str(reminder.id)}
                for reminder in category.alerts.all()
            ],
            'limit_amount': category.limit_amount + 100,
        }

        response = self.client.put(
            reverse('categories-detail', kwargs={'pk': category.id}),
            data=json.dumps(payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

        # Make sure the new category was created
        self.assertNotEqual(response.data['id'], category.id)
        category.refresh_from_db()
        self.assertIsNotNone(category.removed_on)

    def test_get_spending_history(self):
        '''
        Test the category endpoint that returns the spending summary for each
        month until the user started. The response will probably return nothing
        since the db is empty, but we still want to test the endpoint to make sure
        nothing breaks.
        '''

        category = Category.objects.filter(
            usercategory__user=self.user).first()

        response = self.client.get(
            reverse('categories-spending-history', kwargs={'pk': category.id})
        )
        self.assertEqual(response.status_code, 200)

    def test_delete_category(self):
        '''
        Add five transactions to the first category found belonging to the test user
        Delete the category
        Make sure the category is no longer active according to the field
        Make sure the transactions are no longer associated with the category
        '''

        # 1
        category = Category.objects.filter(
            usercategory__user=self.user).first()
        transactions = Transaction.objects.filter(
            account__useraccount__user=self.user
        )[:5]
        TransactionCategory.objects.bulk_create(
            [TransactionCategory(transaction=t, category=category, fraction=1)
             for t in transactions])

        # 2
        tz = time.timezone/60
        response = self.client.delete(
            reverse('categories-items'),
            json.dumps({
                'categories': [str(category.id)],
                'tz': tz,
            }),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 204)

        # 3
        category.refresh_from_db()
        self.assertEqual(category.removed_on is not None, True)

        # 4
        tz_offset = timedelta(minutes=tz)
        tz = timezone(tz_offset)
        start = datetime.utcnow().replace(tzinfo=tz).replace(
            day=1, hour=0, minute=0, second=0, microsecond=0)
        end = datetime.now().replace(tzinfo=tz).replace(
            minute=0, second=0, microsecond=0)

        transactions = Transaction.objects.filter(
            account__useraccount__user=self.user,
            transactioncategory__category=category,
            datetime__range=(start, end)
        )
        self.assertEqual(transactions.count(), 0)

    @timeit
    def test_update_category_amount(self):
        '''
        When a category's limit_amount is updated when the category has existed
        for more than a month, then a new category will need to be created on the
        backend and the transactions for the month associated with the old category
        will need to be associated with the new category.
        '''
        category = Category.objects.filter(removed_on__isnull=True,
                                           is_default=False).first()
        payload = {
            'limit_amount': category.limit_amount + 100,
            'emoji': category.emoji,
            'name': category.name,
            'period': category.period,
        }

        response = self.client.put(
            reverse('categories-detail', kwargs={'pk': category.id}),
            data=json.dumps(payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data['id'], category.id)

        # Check to make sure all of the transactions for the current month
        # have been moved to the new category
        transactions = TransactionCategory.objects.filter(
            category_id=category.id,
            transaction__date__month=datetime.now().month)

        self.assertEqual(transactions.count(), 0)

    @timeit
    def test_update_bill_amount(self):
        '''
        When a bill's amount is updated when the bill has existed
        for more than a month, then a new bill will need to be created on the
        backend and the transactions for the month associated with the old bill
        will need to be associated with the new bill.
        '''

        bill = Bill.objects.filter(removed_on__isnull=True).first()
        payload = {
            'name': bill.name,
            'period': bill.period,
            'upper_amount': bill.upper_amount + 100,
            'day': bill.day,
            'week': bill.week,
            'week_day': bill.week_day,
            'month': bill.month,
        }

        response = self.client.put(
            reverse('bills-detail', kwargs={'pk': bill.id}),
            data=json.dumps(payload),
            content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data['id'], bill.id)

        # Check to make sure all of the transactions for the current month
        # have been moved to the new bill
        transactions = Transaction.objects.filter(
            bill=bill.id,
            date__month=datetime.now().month)
        self.assertEqual(transactions.count(), 0)

    def test_get_reminders(self):
        response = self.client.get(reverse('reminders'))
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data.__len__(), 0)


class BudgetViewTestDestroy(ViewTestsMixin):

    def test_destroy_bill(self):
        bills = Bill.objects.all()[:3]
        args = ['all', 'single', 'composite']
        for i, bill in enumerate(bills):
            bill.users.add(self.user)
            self._destroy_bill(bill, args[i])

    def _destroy_bill(self, bill, instances):
        '''
        Test deleting a bill and making sure the bill is no longer active
        '''

        response = self.client.delete(
            reverse('bills-detail',
                    kwargs={'pk': bill.id},
                    query_kwargs={'instances': instances})
        )

        self.assertEqual(response.status_code, 204)
        bill.refresh_from_db()
        self.assertEqual(bill.removed_on is not None, True)
