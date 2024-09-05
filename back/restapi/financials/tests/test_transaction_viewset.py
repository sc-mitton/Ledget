import time
import json
from unittest.mock import patch
from django.conf import settings

from restapi.utils import reverse
from restapi.tests.mixins import ViewTestsMixin
from django.utils import timezone

from financials.models import Transaction, PlaidItem, Note
from budget.models import Category, Bill
from financials.views.transactions import plaid_client


class TestTransactionViewSet(ViewTestsMixin):

    def setUp(self):
        super().setUp()
        self.add_user_to_budget_categories(self.user)
        self.add_user_to_budget_bills(self.user)
        self.set_user_on_all_plaid_items(self.user)

        self.transaction = Transaction.objects \
            .filter(account__useraccount__user=self.user) \
            .first()

        self.sync_response = None

        response_file = \
            settings.TEST_DATA_DIR / 'responses' / 'plaid_sync_response.json'
        with open(response_file, 'r') as f:
            self.sync_response = json.load(f)

    def test_get_merchants(self):
        response = self.client.get(reverse('transactions-merchants'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def test_confirm_transaction_category(self):
        transaction = Transaction.objects.all().first()
        category = Category.objects.filter(
            usercategory__user=self.user).first()
        payload = [{
            'transaction_id': transaction.transaction_id,
            'splits': [{
                'category': category.id,
                'fraction': 1
            }]
        }]
        response = self.client.post(
            reverse('transactions-confirmation'),
            payload,
            format='json'
        )
        self.assertEqual(response.status_code, 200)
        transaction.refresh_from_db()
        self.assertIn(category, transaction.categories.all())

    def test_confirm_transaction_bill(self):
        transaction = Transaction.objects.all().first()
        bill = Bill.objects.filter(
            userbill__user=self.user).first()

        payload = [{
            'transaction_id': transaction.transaction_id,
            'bill': bill.id,
        }]
        response = self.client.post(
            reverse('transactions-confirmation'),
            payload,
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        transaction.refresh_from_db()
        self.assertEqual(transaction.bill, bill)

    def test_clear_transaction_budget_associations(self):
        '''
        Test updating a transaction to not being labeled as spend
        '''

        transaction = Transaction.objects.filter(
            account__useraccount__user=self.user,
            is_spend=True).first()

        response = self.client.patch(
            reverse('transactions-detail', args=[transaction.transaction_id]),
            {'is_spend': False},
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        transaction.refresh_from_db()
        self.assertEqual(transaction.categories.count(), 0)

    def test_get_transaction(self):
        transaction = Transaction.objects.all().first()
        response = self.client.get(
            reverse('transactions-detail', args=[transaction.transaction_id]))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def test_get_transactions(self):
        account = self.user.accounts.all().first()
        response = self.client.get(
            reverse('transactions-list', query_kwargs={'account': account.id})
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def test_get_recurring_transactions(self):
        pass

    @patch.object(plaid_client, 'transactions_sync')
    def test_sync_transactions(self, mock_sync):
        mock_response = mock_sync.return_value
        mock_response.to_dict.return_value = self.sync_response

        # Delete all transactions and reset all account cursors
        Transaction.objects.all().delete()
        plaid_items = PlaidItem.objects.filter(user=self.user)
        for item in plaid_items:
            item.cursor = None
            item.save()

        response = self.client.post(reverse('transactions-sync'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data['added'])

        for item in plaid_items:
            item.refresh_from_db()
            self.assertGreater(
                item.last_synced,
                timezone.now() - timezone.timedelta(seconds=30))

    def test_count_transactions(self):
        response = self.client.get(reverse(
            'transactions-count',
            query_kwargs={'account': self.user.accounts.all().first().id}
        ))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def test_confirmation_non_list_returns_error(self):
        response = self.client.post(
            reverse('transactions-confirmation'),
            data={},
            format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_get_transactions_recurring(self):
        response = self.client.get(reverse('transactions-recurring'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def test_get_transactions_for_specific_month_and_year(self):
        date = timezone.now() - timezone.timedelta(days=30)

        response = self.client.get(reverse(
            'transactions-list',
            query_kwargs={
                'month': date.month,
                'year': date.year,
                'account': self.user.accounts.all().first().id
            }
        ))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def test_get_transactions_with_start_and_end(self):
        response = self.client.get(reverse(
            'transactions-list',
            query_kwargs={
                'start': round(time.time()) - 60 * 60 * 24 * 30,
                'end': round(time.time()),
                'account': self.user.accounts.all().first().id
            }
        ))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def test_adding_note_to_transaction(self):
        """Test adding a note to a transaction."""

        response = self.client.post(
            reverse('note-list', kwargs={'id': self.transaction.pk}),
            {'text': 'This is a note'}
        )

        self.assertEqual(response.status_code, 201)
        notes = Note.objects.filter(transaction=self.transaction)
        self.assertEqual(any(note.text == 'This is a note' for note in notes), True)

    def test_updating_note_to_transaction(self):
        """Test updating a note for a transaction."""

        note = Note.objects.create(
            transaction=self.transaction,
            user=self.user,
            text='This is a note'
        )

        edited_note = 'This is a new note'
        response = self.client.put(
            reverse('note-detail', kwargs={'id': self.transaction.pk, 'pk': note.pk}),
            {'text': edited_note}
        )

        self.assertEqual(response.status_code, 200)
        note.refresh_from_db()
        self.assertEqual(note.text, edited_note)

    def test_updating_transaction_preferred_name(self):
        """Test adding a preferred name to a transaction."""

        preferred_name = 'Preferred Name'
        response = self.client.patch(
            reverse('transactions-detail', kwargs={'pk': self.transaction.pk}),
            {'preferred_name': preferred_name}
        )

        self.assertEqual(response.status_code, 200)
        self.transaction.refresh_from_db()
        self.assertEqual(self.transaction.preferred_name, preferred_name)
