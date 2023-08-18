import logging
import os
import json

from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    DestroyAPIView
)
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
    HTTP_204_NO_CONTENT
)
import plaid
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.item_remove_request import ItemRemoveRequest
from plaid.model.link_token_create_request_user import (
    LinkTokenCreateRequestUser
)
from plaid.model.transactions_sync_request import (
    TransactionsSyncRequest
)
from plaid.model.transactions_sync_request_options import (
    TransactionsSyncRequestOptions
)

from core.permissions import (
    IsAuthedVerifiedSubscriber,
    IsVerifiedAuthenticated,
    IsObjectOwner
)
from core.clients import plaid_client
from financials.models import PlaidItem
from financials.models import Transactions
from financials.serializers import (
    ExchangePlaidTokenSerializer,
    PlaidItemsSerializer
)


logger = logging.getLogger('ledget')

PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')
PLAID_REDIRECT_URI = settings.PLAID_REDIRECT_URI
PLAID_COUNTRY_CODES = settings.PLAID_COUNTRY_CODES

plaid_products = []
for product in PLAID_PRODUCTS:
    plaid_products.append(Products(product))


class TransactionsSyncView(APIView):
    permission_classes = [IsAuthedVerifiedSubscriber]

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

            self.add_data(added)
            self.modify_data(modified)
            self.remove_data(removed)

            return Response(latest_transactions, status=HTTP_200_OK)

        except plaid.ApiException as e:

            return Response(
                {'error': {e.message}},
                status=HTTP_400_BAD_REQUEST
            )

    def add_data(self, data):
        pass

    def modify_data(self, data):
        pass

    def remove_data(self, data):
        pass


class PlaidLinkTokenView(APIView):
    permission_classes = [IsVerifiedAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            request = LinkTokenCreateRequest(
                products=plaid_products,
                client_name='Ledget',
                country_codes=list(
                    map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)
                ),
                language='en',
                user=LinkTokenCreateRequestUser(
                    client_user_id=str(request.user.id)
                )
            )
            request['redirect_uri'] = PLAID_REDIRECT_URI
            response = plaid_client.link_token_create(request)
            return Response(data=response.to_dict(),
                            status=HTTP_200_OK)
        except plaid.ApiException as e:
            return Response(
                {'error': json.loads(e.body)},
                status=e.status
            )


class PlaidTokenExchangeView(CreateAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = ExchangePlaidTokenSerializer


class PlaidItemsListView(ListAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = PlaidItemsSerializer

    def get_queryset(self):
        return PlaidItem.objects.filter(user=self.request.user).all()


class DestroyPlaidItemView(DestroyAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber, IsObjectOwner]

    def get_object(self):
        obj = get_object_or_404(PlaidItem, pk=self.kwargs['item_id'])
        self.check_object_permissions(self.request, obj)
        return obj

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()

        try:
            request = ItemRemoveRequest(access_token=obj.access_token)
            plaid_client.item_remove(request)
        except plaid.ApiException as e:
            return Response({'error': json.loads(e.body)}, status=e.status)
        else:
            self.perform_destroy(obj)
            return Response(status=HTTP_204_NO_CONTENT)
