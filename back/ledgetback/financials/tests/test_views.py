
from django.urls import reverse

from ledgetback.tests.mixins import ViewTestsMixin
from financials.models import Transaction, Note, Account


class FinancialViewTestObjectCreations(ViewTestsMixin):
    fixtures = [
        'transaction_fixture.json',
        'account_fixture.json',
        'plaid_item_fixture.json',
        'category_fixture.json',
        'bill_fixture.json',
        'institution_fixture.json',
        'user_fixture.json',
    ]

    def setUp(self):
        super().setUp()

        # add the test use to all of the accounts
        accounts = Account.objects.all()
        self.user.accounts.add(*accounts)

    def test_adding_note_to_transaction(self):
        """Test adding a note to a transaction."""

        transaction = Transaction.objects \
                                 .filter(account__useraccount__user=self.user) \
                                 .first()

        response = self.client.post(
            reverse('note-list', kwargs={'id': transaction.pk}),
            {'text': 'This is a note'}
        )

        self.assertEqual(response.status_code, 201)
        notes = Note.objects.filter(transaction=transaction)
        self.assertEqual(any(note.text == 'This is a note' for note in notes), True)

    def test_updating_transaction(self):
        """Test updating a transaction."""

        transaction = Transaction.objects \
                                 .filter(account__useraccount__user=self.user) \
                                 .first()
        note = Note.objects.create(
            transaction=transaction,
            user=self.user,
            text='This is a note'
        )

        edited_note = 'This is a new note'
        response = self.client.put(
            reverse('note-detail', kwargs={'id': transaction.pk, 'pk': note.pk}),
            {'text': edited_note}
        )

        self.assertEqual(response.status_code, 200)
        note.refresh_from_db()
        self.assertEqual(note.text, edited_note)
