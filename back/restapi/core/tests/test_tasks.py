from unittest.mock import patch, Mock
from django.test import override_settings

# Import the module you want to test after patching
from restapi.tests.mixins import ViewTestsMixin
from core.tasks import cancelation_cleanup
from ory_client.api import identity_api
from plaid.model.item_remove_request import ItemRemoveRequest
from core.tasks import plaid_client  # Import it after patching

plaid_item = {
    'id': 'ZlvW44yxPbIKdmy9Rx65sJyWL3PkZ5fgoaNAv',
    'access_token': 'access-sandbox-6a96f24a-cab6-4151-afd3-2825902f66a3'
}


class TestTasks(ViewTestsMixin):

    @override_settings(
        CELERY_TASK_ALWAYS_EAGER=True,
        CELERY_TASK_EAGER_PROPAGATES=True,
        BROKER_BACKEND='memory'
    )
    @patch.object(plaid_client, 'item_remove')
    @patch.object(identity_api.IdentityApi, 'delete_identity')
    @patch('financials.models.PlaidItem.objects.filter')
    def test_user_cancelation_cleanup(self, mock_filter, mock_identity_api,
                                      mock_item_remove):
        mock_filter.return_value = [Mock(**plaid_item)]

        # The task we're testing
        cancelation_cleanup(str(self.user.id))

        mock_item_remove.assert_called_once_with(ItemRemoveRequest(
            access_token=plaid_item['access_token']
        ))
        mock_identity_api.assert_called_once_with(self.user.id)

        self.user.refresh_from_db()
        self.assertEqual(self.user.is_active, False)
        self.assertEqual(len(self.user.plaiditem_set.all()), 0)
