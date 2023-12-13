import logging
from datetime import datetime
from collections import OrderedDict
import pytz

from django.db import transaction, models
from django.db.models import Q, Prefetch, F

from rest_framework.generics import GenericAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.decorators import action
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
    UpdateTransactionsConfirmationSerializer,
    NoteSerializer,
    MerchantSerializer
)
from financials.models import PlaidItem, Note
from budget.models import Category


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
        logger.error(e)
        raise ValidationError(
            {'plaid': 'error syncing transactions'},
            code=HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(e)
        raise ValidationError(
            {'error': 'Internal server error'},
            code=HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response_data


class TransactionsSyncView(GenericAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber, IsObjectOwner]

    def post(self, request, *args, **kwargs):

        plaid_item = self.get_plaid_item(request)
        sync_results = sync_transactions(plaid_item)

        return Response(sync_results, HTTP_200_OK)

    def get_plaid_item(self, request):
        item_id = self.request.query_params.get('item', None)
        account_id = self.request.query_params.get('account', None)

        if item_id:
            try:
                plaid_item = PlaidItem.objects.get(id=item_id)
            except PlaidItem.DoesNotExist:
                raise ValidationError('Invalid item id')
        elif account_id:
            try:
                plaid_item = PlaidItem.objects.get(accounts__id=account_id)
            except PlaidItem.DoesNotExist:
                raise ValidationError('Invalid account id')
        else:
            raise ValidationError('Invalid request')

        self.check_object_permissions(request, plaid_item)
        return plaid_item


class TransactionsPagination(LimitOffsetPagination):
    page_size = 25
    ordering = '-datetime'

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('next', self.get_next_offset()),
            ('previous', self.get_previous_offset()),
            ('limit', self.limit),
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
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthedVerifiedSubscriber]
    pagination_class = TransactionsPagination

    @action(detail=False, methods=['post'], url_path='confirmation',
            permission_classes=[IsAuthedVerifiedSubscriber])
    def confirm_transactions(self, request, *args, **kwargs):
        if not isinstance(request.data, list):
            raise ValidationError('Invalid request data')

        instances = self.get_instances(request.data)
        serializer = UpdateTransactionsConfirmationSerializer(
            instance=instances,
            data=request.data,
            many=True,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def get_object(self):
        try:
            obj = Transaction.objects.get(
                transaction_id=self.kwargs['pk'],
                account__useraccount__user=self.request.user)
        except Transaction.DoesNotExist:
            raise ValidationError('Transaction does not exist')

        return obj

    def get_instances(self, validated_data):
        transaction_ids = [item['transaction_id'] for item in validated_data]

        try:
            instances = Transaction.objects.filter(
                transaction_id__in=[id for id in transaction_ids if id is not None],
                account__useraccount__user=self.request.user
            )
        except Transaction.DoesNotExist:
            raise ValidationError('One or more of the transactions does not exist.')

        return instances

    def get_queryset(self):
        filter_args = self._exract_filter_args()
        print('filter_args', filter_args)
        base_qset = Transaction.objects.filter(**filter_args) \
                                       .select_related(
                                           'predicted_category',
                                           'predicted_bill') \
                                       .prefetch_related('notes')

        # Get prefetched data for confirmed transactions query
        # , or if unspecified, assume the data should be prefetched
        if self.request.query_params.get('confirmed') == 'true':
            prefetch_categories = Prefetch(
                'categories',
                queryset=Category.objects.all().annotate(
                    fraction=F('transactioncategory__fraction')))

            base_qset = base_qset.filter(
                Q(bill__isnull=False) | Q(transactioncategory__isnull=False)
            ).select_related('bill') \
             .prefetch_related(prefetch_categories)

        return base_qset.prefetch_related('notes') \
                        .order_by('-datetime') \
                        .distinct()

    @action(detail=False, methods=['get'], url_path='merchants',
            url_name='merchants', permission_classes=[IsAuthedVerifiedSubscriber])
    def merchants(self, request, *args, **kwargs):
        qset = Transaction.objects.filter(
            account__useraccount__user=self.request.user,
            merchant_name__isnull=False
        ).distinct('merchant_name').values('merchant_name').order_by('merchant_name')

        serializer = MerchantSerializer(qset, many=True)

        return Response(serializer.data)

    def _extract_start_end_args(self) -> dict:
        params = self.request.query_params
        start = params.get('start', None)
        end = params.get('end', None)

        if not start or not end:
            return {}

        try:
            start = datetime.fromtimestamp(int(start), tz=pytz.utc)
            end = datetime.fromtimestamp(int(end), tz=pytz.utc)
        except ValueError:
            raise ValidationError('Invalid date format')

        return {'datetime__gte': start, 'datetime__lte': end}

    def _exract_filter_args(self):
        query_params = self.request.query_params

        result = {'account__plaid_item__user_id':
                  str(self.request.user.id)}
        result.update(self._extract_start_end_args())

        # If querying for unconfirmed transactions
        if query_params.get('confirmed') != 'true':
            result['bill__isnull'] = True
            result['categories'] = None

        query_params_2_filter_params = {
            'merchant': 'merchant_name__in',
            'account': 'account_id',
            'category': 'transactioncategory__category_id',
            'categories': 'transactioncategory__category_id__in',
            'limit_amount_lower': 'amount__gte',
            'limit_amount_upper': 'amount__lte',
            'type': 'account__type',
            'merchants': 'merchant_name__in',
            'accounts': 'account_id__in',
        }

        for key, value in query_params.items():
            if key not in query_params_2_filter_params:
                continue
            if value == 'true':
                value = True
            elif value == 'false':
                value = False
            result[query_params_2_filter_params[key]] = value

        return result


class NoteViewSet(ModelViewSet):
    permission_classes = [IsAuthedVerifiedSubscriber, IsObjectOwner]
    serializer_class = NoteSerializer

    def get_object(self):
        transaction_id = self.kwargs['id']
        note_id = self.kwargs['pk']
        try:
            obj = Note.objects.get(
                transaction_id=transaction_id,
                id=note_id)
            self.check_object_permissions(self.request, obj)
        except Note.DoesNotExist:
            raise ValidationError('Note does not exist')

        return obj

    def get_transaction(self):
        transaction_id = self.kwargs['id']
        try:

            # object permissions are unneaded since
            # the query filter will return none if the user
            # is not an owner of the transaction
            transaction = Transaction.objects.get(
                    transaction_id=transaction_id,
                    account__useraccount__user=self.request.user)

        except Transaction.DoesNotExist:
            raise ValidationError('Transaction does not exist')

        return transaction

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(
            transaction=self.get_transaction(),
            user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(
            transaction=self.get_transaction(),
            user=self.request.user)
