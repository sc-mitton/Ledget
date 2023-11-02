import logging
from collections import OrderedDict

from django.db import transaction, models
from rest_framework.generics import GenericAPIView
from rest_framework.viewsets import ModelViewSet
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
from financials.serializers.transactions import (
    TransactionSerializer,
    UpdateTransactionsSerializer
)
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


def sync_transactions(plaid_item: PlaidItem) -> dict:
    added, modified, removed = [], [], []
    plaid_options = TransactionsSyncRequestOptions(
        include_personal_finance_category=True
    )

    cursor = plaid_item.cursor or ''
    has_more = True
    response_data = {'added': 0, 'modified': 0, 'removed': 0}

    def _filter_transaction(unfiltered):
        filtered = {}
        for field in filter_target_fields:
            if unfiltered.get(field, False):
                filtered[field] = unfiltered[field]
        for nested_field in Transaction.nested_plaid_fields:
            filtered.update(**unfiltered[nested_field])

        return filtered

    def _extend_lists(response):
        for _ in ['added', 'modified', 'removed']:
            for unfiltered in response[_]:
                filtered = _filter_transaction(unfiltered)
                if _ == 'added':
                    added.append(filtered)
                elif _ == 'modified':
                    modified.append(filtered)
                elif _ == 'removed':
                    removed.append(filtered)

    @transaction.atomic
    def _bulk_add_transactions():
        objs = [Transaction(**added) for added in added]
        Transaction.objects.bulk_create(objs)

    @transaction.atomic
    def _bulk_modify_transactions():
        pass

    @transaction.atomic
    def _bulk_remove_transactions():
        pass

    @transaction.atomic
    def _flush_to_db():
        _bulk_add_transactions()
        _bulk_modify_transactions()
        _bulk_remove_transactions()
        plaid_item.cursor = cursor
        plaid_item.save()

    assert (isinstance(plaid_item, PlaidItem))

    try:
        while has_more:
            response = plaid_client.transactions_sync(
                TransactionsSyncRequest(
                    access_token=plaid_item.access_token,
                    cursor=cursor,
                    options=plaid_options
                )
            ).to_dict()

            has_more = response['has_more']
            cursor = response['next_cursor']
            _extend_lists(response)

            response_data['added'] += len(added)
            response_data['modified'] += len(modified)
            response_data['removed'] += len(removed)
            _flush_to_db()

            # reset buffers
            added, modified, removed = [], [], []

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

    return response_data


class TransactionsSyncView(GenericAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber, IsObjectOwner]

    def post(self, request, *args, **kwargs):

        plaid_item = self.get_plaid_item(request)

        try:
            sync_results = sync_transactions(plaid_item)
        except Exception as e:
            logger.error(e)
            return Response(
                {'error': 'Internal server error'},
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(sync_results, HTTP_200_OK)

    def get_plaid_item(self, request):

        try:
            id = self.request.query_params.get('item', None)
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


class TransactionViewSet(ModelViewSet):
    serializer_classes = [UpdateTransactionsSerializer, TransactionSerializer]
    permission_classes = [IsAuthedVerifiedSubscriber]
    pagination_class = TransactionsPagination

    def get_serializer_class(self):
        if isinstance(self.request.data, list):
            return UpdateTransactionsSerializer
        return TransactionSerializer

    def update(self, request, *args, **kwargs):
        if not isinstance(request.data, list):
            raise ValidationError('Invalid request data')

        serializer = self.get_serializer(
            self.get_queryset(),
            data=request.data,
            partial=True,
            many=True
        )

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def get_object(self):
        id = self.kwargs.get('pk', None)
        account = self.request.query_params.get('account', None)
        try:
            return Transaction.objects.get(
                account__plaid_item__user_id=self.request.user.id,
                account__id=account,
                id=id
            )
        except Transaction.DoesNotExist:
            raise ValidationError('Invalid transaction id')

    def get_queryset(self):
        params = self.request.query_params
        month = params.get('month', None)
        confirmed = params.get('confirmed', None)

        if confirmed == 'true' and month:
            return self._get_confirmed_transactions(month)
        elif confirmed == 'false' and month:
            return self._get_unconfirmed_transactions(month)
        else:
            return self._get_transactions()

    def _get_confirmed_transactions(self, month):

        qset = Transaction.objects.filter(
            date__month=month,
            bill_confirmed=True,
            category_confirmed=True,
        ).select_related('category', 'bill')

        return qset

    def _get_unconfirmed_transactions(self, month):

        qset = Transaction.objects.filter(
            date__month=month,
            bill_confirmed=False,
            category_confirmed=False,
        ).select_related('category', 'bill')

        return qset

    def _get_transactions(self):
        type = self.request.query_params.get('type', None)
        account = self.request.query_params.get('account', None)

        return Transaction.objects.filter(
            account__plaid_item__user_id=self.request.user.id,
            account__type=type,
            account_id=account
        ).select_related('category', 'bill')

    def perform_update(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        raise ValidationError('Transactions cannot be created')

    def delete(self, request, *args, **kwargs):
        raise ValidationError('Transactions cannot be deleted')
