from unittest.mock import patch
from django.test import override_settings

# Import the module you want to test after patching
from restapi.tests.mixins import ViewTestsMixin, session_payloads
from core.tasks import cancelation_cleanup, cleanup_hanging_ory_users
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

    @patch.object(identity_api, 'IdentityApi')
    def test_cleanup_hanging_ory_users(self, mock_identity_api):
        mock_api_instance = mock_identity_api.return_value
        mock_api_instance.get_identity.return_value = \
            session_payloads[0]['session']['identity']

        cleanup_hanging_ory_users(str(self.user.id))

        mock_api_instance.get_identity.assert_called_once_with(self.user.id)
