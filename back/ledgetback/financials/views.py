import logging
import os
import json

from django.shortcuts import get_object_or_404
from django.conf import settings
from django.db import transaction, models
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView,
    GenericAPIView
)
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
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
    IsObjectOwner,
    highest_aal_freshness
)
from financials.models import PlaidItem, Transaction
from core.clients import create_plaid_client
from financials.serializers import (
    ExchangePlaidTokenSerializer,
    PlaidItemsSerializer,
    TransactionsSyncSerializer
)

plaid_client = create_plaid_client()

logger = logging.getLogger('ledget')

PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')
PLAID_REDIRECT_URI_ONBOARDING = settings.PLAID_REDIRECT_URI_ONBOARDING
PLAID_REDIRECT_URI = settings.PLAID_REDIRECT_URI
PLAID_COUNTRY_CODES = settings.PLAID_COUNTRY_CODES

plaid_products = []
for product in PLAID_PRODUCTS:
    plaid_products.append(Products(product))


transaction_fields = [
    f.name if not issubclass(f.__class__, models.ForeignKey)
    else f"{f.name}_id"
    for f in Transaction._meta.fields
]
filter_target_fields = [
    f for f in transaction_fields if f not in Transaction.ignored_plaid_fields
]


class TransactionsSyncView(GenericAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = TransactionsSyncSerializer
    plaid_options = TransactionsSyncRequestOptions(
        include_personal_finance_category=True
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.added = []
        self.modified = []
        self.removed = []
        self.first_sync = False

    def post(self, request, *args, **kwargs):
        plaid_item = self.get_plaid_item(request)
        if not plaid_item:
            self.first_sync = True
        cursor = plaid_item.cursor or ''
        has_more = True

        try:
            while has_more:
                response = plaid_client.transactions_sync(
                    TransactionsSyncRequest(
                        access_token=plaid_item.access_token,
                        cursor=cursor,
                        options=self.plaid_options
                    )
                ).to_dict()

                has_more = response['has_more']
                cursor = response['next_cursor']
                self.extend_lists(response)
            self.flush_to_db(plaid_item, cursor)

        except plaid.ApiException as e:
            return Response(
                {'error': {e}},
                status=HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(e)
            return Response(
                {'error': 'Internal server error'},
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(status=HTTP_200_OK)

    def extend_lists(self, response):
        for _ in ['added', 'modified', 'removed']:
            for unfiltered in response[_]:
                filtered = self.filter_transaction(unfiltered)
                getattr(self, _).append(filtered)

    def filter_transaction(self, unfiltered):
        filtered = {}
        for field in filter_target_fields:
            if unfiltered.get(field, False):
                filtered[field] = unfiltered[field]
        for nested_field in Transaction.nested_plaid_fields:
            filtered.update(**unfiltered[nested_field])

        return filtered

    @transaction.atomic
    def flush_to_db(self, plaid_item, cursor):
        self.bulk_add_transactions()
        self.bulk_modify_transactions()
        self.bulk_remove_transactions()
        plaid_item.cursor = cursor
        plaid_item.save()

        # reset buffers
        self.added = []
        self.modified = []
        self.removed = []

    @transaction.atomic
    def bulk_add_transactions(self):
        objs = [Transaction(**added) for added in self.added]
        Transaction.objects.bulk_create(objs)

    @transaction.atomic
    def bulk_modify_transactions(self):
        pass

    @transaction.atomic
    def bulk_remove_transactions(self):
        pass

    def get_plaid_item(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return serializer.validated_data['item_id']


class PlaidLinkTokenView(APIView):
    permission_classes = [IsAuthedVerifiedSubscriber]

    def get(self, request, *args, **kwargs):
        if kwargs.get('is_onboarding', False):
            redirect_uri = PLAID_REDIRECT_URI_ONBOARDING
        else:
            redirect_uri = PLAID_REDIRECT_URI

        request_kwargs = {
            'client_name': 'Ledget',
            'country_codes': list(
                map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)
            ),
            'language': 'en',
            'redirect_uri': redirect_uri,
            'user': LinkTokenCreateRequestUser(
                client_user_id=str(request.user.id)
            )
        }

        if kwargs.get('item_id', False):
            request_kwargs['access_token'] = \
                PlaidItem.objects.get(id=kwargs['item_id']).access_token
            request_kwargs['update'] = {"account_selection_enabled": True}
        else:
            request_kwargs['products'] = plaid_products

        try:
            request = LinkTokenCreateRequest(**request_kwargs)
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


class PlaidItemView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber, IsObjectOwner]
    serializer_class = PlaidItemsSerializer

    def get_object(self):
        obj = get_object_or_404(PlaidItem, pk=self.kwargs['item_id'])
        self.check_object_permissions(self.request, obj)
        return obj

    @highest_aal_freshness
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
