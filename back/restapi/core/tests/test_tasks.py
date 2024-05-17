from unittest.mock import patch
from django.test import override_settings

# Import the module you want to test after patching
from restapi.tests.mixins import ViewTestsMixin
from core.tasks import cancelation_cleanup
from plaid.model.item_remove_request import ItemRemoveRequest
from core.tasks import plaid_client, identity_api  # Import it after patching


class TestTasks(ViewTestsMixin):
    fixtures = [
        'plaid_item_fixture.json',
        'institution_fixture.json',
        'core_account_fixture.json',
        'customer_fixture.json',
        'user_fixture.json',
    ]

    def setUp(self):
        super().setUp()
        self.set_user_on_all_plaid_items(self.user)

    @override_settings(
        CELERY_TASK_ALWAYS_EAGER=True,
        CELERY_TASK_EAGER_PROPAGATES=True,
        BROKER_BACKEND='memory'
    )
    @patch.object(plaid_client, 'item_remove')
    @patch.object(identity_api.IdentityApi, 'delete_identity')
    def test_user_cancelation_cleanup(self, mock_delete_identity, mock_item_remove):
        plaid_item_access_tokens = self.user.plaiditem_set.values_list(
                                        'access_token', flat=True)

        # The task we're testing
        cancelation_cleanup(str(self.user.id))

        # Checks
        for token in plaid_item_access_tokens:
            mock_item_remove.assert_called_once_with(
                ItemRemoveRequest(access_token=token))

        mock_delete_identity.assert_called_once_with(self.user.id)

        self.user.refresh_from_db()
        self.assertEqual(self.user.is_active, False)
        self.assertEqual(len(self.user.plaiditem_set.all()), 0)
