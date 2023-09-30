from unittest.mock import patch, Mock

from core.tasks import cleanup
from ledgetback.tests.mixins import ViewTestsMixin
from django.test import override_settings
from core.clients import plaid_client
from ory_client.api import identity_api
from plaid.model.item_remove_request import ItemRemoveRequest


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
    def test_user_delete_cleanup(self, mock_filter, mock_identity_api,
                                 mock_plaid_client):

        mock_filter.return_value = [Mock(**plaid_item)]

        cleanup(self.user.id)
        mock_plaid_client.assert_called_once_with(ItemRemoveRequest(
            access_token=plaid_item['access_token']
        ))
        mock_identity_api.assert_called_once_with(self.user.id)
