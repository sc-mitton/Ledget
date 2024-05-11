from django.test import TestCase
from plaid.model.item_webhook_update_request import ItemWebhookUpdateRequest

from financials.models import PlaidItem
from core.clients import create_plaid_client

plaid_client = create_plaid_client()


class PlaidWebhookTests(TestCase):
    fixtures = ['plaid_item_fixture.json']

    def setUp(self):
        self.ngrok_tunnel = None
        with open('.ngrok_plaid_tunnel', 'r') as f:
            self.ngrok_tunnel = f.read().strip()

        items = PlaidItem.objects.all()
        for item in items:
            self._update_item_webhook(item)

    def _update_item_webhook(self, item):
        request = ItemWebhookUpdateRequest(
            access_token=item.access_token,
            webhook=self.ngrok_tunnel + '/hooks/plaid/item',
        )
        plaid_client.item_webhook_update(request)

    def test_handle_error_hook(self):
        pass

    def test_handle_login_repared_hook(self):
        pass

    def test_handle_new_account_available_hook(self):
        pass

    def test_handle_user_permission_revoked_hook(self):
        pass

    def test_handle_pending_expiration_hook(self):
        pass

    def test_handle_webook_update_acknowledged_hook(self):
        pass

    def test_handle_session_finished_hook(self):
        pass

    def test_handle_transactions_removed_hook(self):
        pass

    def test_handle_initial_update_complete_hook(self):
        pass

    def test_handle_sync_updates_available_hook(self):
        pass
