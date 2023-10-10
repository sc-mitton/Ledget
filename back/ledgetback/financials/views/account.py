from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from plaid.model.accounts_get_request import AccountsGetRequest
import plaid

from core.permissions import IsAuthedVerifiedSubscriber
from core.clients import create_plaid_client
from financials.models import PlaidItem

plaid_client = create_plaid_client()


class AccountsView(GenericAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]

    def get(self, request, *args, **kwargs):
        '''Get all the account data belonging to a specific user'''

        plaid_items = PlaidItem.objects.filter(user_id=request.user.id)
        accounts = []
        try:
            for plaid_item in plaid_items:
                request = AccountsGetRequest(access_token=plaid_item.access_token)
                response = plaid_client.accounts_get(request).to_dict()
                accounts += response['accounts']
        except plaid.ApiException as e:
            return Response(
                data={'error': {'message': str(e)}},
                status=e.status,
            )

        return Response(data={'accounts': accounts}, status=HTTP_200_OK)
