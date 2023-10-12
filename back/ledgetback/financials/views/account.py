from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from plaid.model.accounts_get_request import AccountsGetRequest
import plaid

from core.permissions import IsAuthedVerifiedSubscriber
from core.clients import create_plaid_client
from financials.models import PlaidItem
from financials.serializers.accounts import InstitutionSerializer

plaid_client = create_plaid_client()


class AccountsView(GenericAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]

    def get(self, request, *args, **kwargs):
        '''Get all the account data belonging to a specific user'''

        plaid_items = PlaidItem.objects.filter(user_id=request.user.id) \
                                       .select_related('institution')

        accounts = []
        try:
            for plaid_item in plaid_items:
                request = AccountsGetRequest(access_token=plaid_item.access_token)
                response = plaid_client.accounts_get(request).to_dict()
                fetched_accounts = [
                    {**account, 'institution_id': plaid_item.institution.id}
                    for account in response['accounts']
                ]
                accounts += fetched_accounts
        except plaid.ApiException as e:
            return Response({'error': {'message': str(e)}}, e.status)

        institution_data = [
            InstitutionSerializer(plaid_item.institution).data
            for plaid_item in plaid_items
        ]

        return Response(
            {'accounts': accounts, 'institutions': institution_data},
            HTTP_200_OK
        )
