from restapi.utils import reverse
from restapi.tests.mixins import ViewTestsMixin

from django.utils import timezone

from financials.models import Transaction, PlaidItem
from budget.models import Category, Bill


class TestTransactionViewSet(ViewTestsMixin):

    def setUp(self):
        super().setUp()
        self.add_user_to_budget_categories(self.user)
        self.add_user_to_budget_bills(self.user)
        self.set_user_on_all_plaid_items(self.user)

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

    def test_sync_transactions(self):

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
