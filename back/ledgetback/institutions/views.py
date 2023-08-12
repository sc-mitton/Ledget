from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK
)
import plaid
from plaid.model.transactions_sync_request import (
    TransactionsSyncRequest
)
from plaid.model.transactions_sync_request_options import (
    TransactionsSyncRequestOptions
)

from core.permissions import IsUserOwner
from core.clients import plaid_client
from core.models import PlaidItem
from institutions.models import Transactions


class TransactionsSyncView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsUserOwner]

    def post(self, request, *args, **kwargs):
        item_id = request.data.get('item_id', '')
        cursor = Transactions.get_latest_cursor(item_id)

        try:
            access_token = PlaidItem.objects.get(id=item_id).access_token
        except PlaidItem.DoesNotExist:
            return Response(
                {'error': 'Item does not exist'},
                status=HTTP_400_BAD_REQUEST
            )

        options = TransactionsSyncRequestOptions(
            include_personal_finance_category=False
        )

        request = TransactionsSyncRequest(
            access_token=access_token,
            cursor=cursor,
            options=options
        )

        try:
            added = []
            modified = []
            removed = []
            has_more = True
            while has_more:
                response = plaid_client.transactions_sync(request).to_dict()

                added.extend(response['added'])
                modified.extend(response['modified'])
                removed.extend(response['removed'])
                has_more = response['has_more']

                cursor = response['next_cursor']
                latest_transactions = sorted(added, key=lambda t: t['date'])[-8:] # noqa

            self.store_data(added, modified, removed)

            return Response(latest_transactions, status=HTTP_200_OK)

        except plaid.ApiException as e:

            return Response(
                {'error': {e.message}},
                status=HTTP_400_BAD_REQUEST
            )

    def store_data(self, added, modified, removed):
        pass
