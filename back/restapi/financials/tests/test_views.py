
from django.urls import reverse

from restapi.tests.mixins import ViewTestsMixin
from financials.models import Transaction, Note, Account
from budget.models import Category


class FinancialViewTestObjectCreations(ViewTestsMixin):
    fixtures = [
        'transaction_fixture.json',
        'account_fixture.json',
        'plaid_item_fixture.json',
        'category_fixture.json',
        'bill_fixture.json',
        'institution_fixture.json',
        'core_account_fixture.json',
        'customer_fixture.json',
        'user_fixture.json',
    ]

    def setUp(self):
        super().setUp()

        # add the test use to all of the accounts
        accounts = Account.objects.all()
        self.user.accounts.add(*accounts)
        self.transaction = Transaction.objects \
            .filter(account__useraccount__user=self.user) \
            .first()

        # add the test user to all of the categories
        categories = Category.objects.all()
        self.user.categories.add(*categories)

    def test_adding_note_to_transaction(self):
        """Test adding a note to a transaction."""

        response = self.client.post(
            reverse('note-list', kwargs={'id': self.transaction.pk}),
            {'text': 'This is a note'}
        )

        self.assertEqual(response.status_code, 201)
        notes = Note.objects.filter(transaction=self.transaction)
        self.assertEqual(any(note.text == 'This is a note' for note in notes), True)

    def test_updating_transaction_category(self):

        new_category = Category.objects.filter(
            usercategory__user=self.user
        ).exclude(
            id__in=Category.objects.filter(
                transactioncategory__transaction=self.transaction
            ).values_list('id', flat=True)
        ).first()

        payload = [{'transaction_id': self.transaction.pk,
                    'splits': [{
                        'category': str(new_category.pk),
                        'fraction': 1
                    }]}]

        response = self.client.post(
            reverse('transactions-confirm-transactions'),
            payload,
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        self.transaction.refresh_from_db()

        new_category_in_transaction = self.transaction.categories.filter(
            pk=new_category.pk)
        self.assertEqual(new_category_in_transaction.exists(), True)

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
