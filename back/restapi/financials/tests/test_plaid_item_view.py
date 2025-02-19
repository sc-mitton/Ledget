
import copy
from unittest.mock import patch, MagicMock

from django.urls import reverse
from django.conf import settings
from plaid.model.item_remove_request import ItemRemoveRequest

from restapi.tests.mixins import ViewTestsMixin, encode_jwt
from financials.models import PlaidItem, Institution, Account
from financials.views.items import plaid_client
from financials.serializers.items import plaid_client as serializer_plaid_client
from financials.serializers.account import InstitutionSerializer, AccountSerializer


class FakeLinkCreateResponse(MagicMock):
    def to_dict(self):
        return {
            'link_token': 'link-sandbox-123'
        }


class TestPlaidItemView(ViewTestsMixin):

    def setUp(self):
        super().setUp()
        self.set_user_on_all_plaid_items(self.aal2_user)
        self.aal2_user.settings.mfa_method = 'totp'
        self.aal2_user.save()
        self.item = PlaidItem.objects.all().first()

    def test_delete_plaid_item_permission_error(self):
        '''
        Test that trying to delete a plaid item without proper aal freshness, or
        high enough aal, returns a 401.
        '''

        # Test with stale session
        session = copy.deepcopy(self.aal2_payload)
        session['session']['authentication_methods'][0]['completed_at'] = 0
        self.aal2_client.defaults[settings.OATHKEEPER_JWT_HEADER] = '{} {}'.format(
            settings.OATHKEEPER_JWT_AUTH_SCHEME, encode_jwt(session))
        response = self.aal2_client.delete(
            reverse('plaid-item-detail', kwargs={'id': self.item.id}))
        self.assertEqual(response.status_code, 401)

        # Test with aal1 when it should be highest aal
        response = self.aal2_client.delete(
            reverse('plaid-item-detail', kwargs={'id': self.item.id}),
            headers={
                settings.OATHKEEPER_JWT_AUTH_SCHEME:
                f'{settings.OATHKEEPER_JWT_HEADER} {encode_jwt(self.aal1_payload)}'
            }
        )
        self.assertEqual(response.status_code, 401)

    @patch.object(plaid_client, 'item_remove')
    def test_delete_plaid_item(self, mock_item_remove):
        response = self.aal2_client.delete(
            reverse('plaid-item-detail', kwargs={'id': self.item.id}))
        self.assertEqual(response.status_code, 204)

        # Checks
        request = ItemRemoveRequest(access_token=self.item.access_token)
        mock_item_remove.assert_called_once_with(request)

        item = PlaidItem.objects.filter(id=self.item.id).first()
        self.assertIsNone(item)

    @patch.object(plaid_client, 'link_token_create')
    def test_plaid_update_link_token(self, mock_link_token_create):
        mock_link_token_create.return_value = FakeLinkCreateResponse()

        response = self.client.get(
            reverse('plaid-update-link-token',
                    kwargs={'id': self.item.id})
        )
        self.assertEqual(response.status_code, 200)

    @patch.object(serializer_plaid_client, 'item_public_token_exchange')
    def test_plaid_token_exchange(self, mock_item_public_token_exchange):
        mock_item_public_token_exchange.return_value = {
            'item_id': 'item-sandbox-123',
            'access_token': 'access-sandbox-123'
        }

        account_objs = Account.objects.all()
        instution_obj = Institution.objects.all().first()
        institution_data = InstitutionSerializer(instution_obj).data
        account_data = AccountSerializer(account_objs, many=True).data

        response = self.client.post(
            reverse('plaid-token-exchange'),
            data={
                'public_token': 'public-sandbox-123',
                'institution': institution_data,
                'accounts': account_data
            },
            format='json'
        )
        self.assertEqual(response.status_code, 201)
