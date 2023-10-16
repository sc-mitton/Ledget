import logging
from collections import OrderedDict

from django.db import transaction, models
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_200_OK
)
import plaid

from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.model.transactions_sync_request_options import (
    TransactionsSyncRequestOptions
)

from core.permissions import IsAuthedVerifiedSubscriber, IsObjectOwner
from core.clients import create_plaid_client
from financials.models import Transaction
from financials.serializers.transactions import TransactionSerializer
from financials.models import PlaidItem


plaid_client = create_plaid_client()
logger = logging.getLogger('ledget')


transaction_fields = [
    f.name if not issubclass(f.__class__, models.ForeignKey)
    else f"{f.name}_id"
    for f in Transaction._meta.fields
]
filter_target_fields = [
    f for f in transaction_fields if f not in Transaction.ignored_plaid_fields
]


class TransactionsSyncView(GenericAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber, IsObjectOwner]
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
        response_data = {'added': 0, 'modified': 0, 'removed': 0}

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

            response_data['added'] += len(self.added)
            response_data['modified'] += len(self.modified)
            response_data['removed'] += len(self.removed)
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

        return Response(response_data, HTTP_200_OK)

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

        try:
            id = self.request.query_params.get('item', None)
            print('id', id)
            plaid_item = PlaidItem.objects.get(accounts__id=id)
        except PlaidItem.DoesNotExist:
            raise ValidationError('Invalid account id')

        self.check_object_permissions(request, plaid_item)
        return plaid_item


class TransactionsPagination(LimitOffsetPagination):
    page_size = 25
    ordering = '-datetime'

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('next', self.get_next_offset()),
            ('previous', self.get_previous_offset()),
            ('results', data)
        ]))

    def get_next_offset(self):
        if self.offset + self.limit >= self.count:
            return None

        return self.offset + self.limit

    def get_previous_offset(self):
        if self.offset <= 0:
            return None
        return self.offset - self.limit


class TransactionsView(ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthedVerifiedSubscriber]
    pagination_class = TransactionsPagination

    def get_queryset(self):

        type = self.request.query_params.get('type', None)
        account = self.request.query_params.get('account', None)

        return Transaction.objects.filter(
            account__plaid_item__user_id=self.request.user.id,
            account__type=type,
            account_id=account
        )
