import logging
import json
from datetime import datetime, timedelta
from collections import OrderedDict
import pytz

from django.db import transaction
from django.db.models import Q, Prefetch
from django.utils import timezone

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

# from plaid.model.transactions_recurring_get_request import (
#     TransactionsRecurringGetRequest
# )
from plaid.model.transactions_recurring_get_request import (
    TransactionsRecurringGetRequest
)
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.model.transactions_sync_request_options import TransactionsSyncRequestOptions

from restapi.permissions.auth import IsAuthedVerifiedSubscriber, IsAuthenticated
from restapi.permissions.objects import (
    IsObjectOwner,
    HasObjectAccessLooseWrite
)
from core.clients import create_plaid_client
from financials.models import Transaction
from financials.serializers.transactions import (
    TransactionSerializer,
    UpdateTransactionsConfirmationSerializer,
    NoteSerializer,
    MerchantSerializer
)
from financials.serializers.recurring_transaction import RecurringTransaction
from financials.serializers.plaid import PlaidTransactionSerializer
from financials.models import PlaidItem, Note
from budget.models import Category, TransactionCategory


plaid_client = create_plaid_client()
logger = logging.getLogger('ledget')

QUERY_PARAMS_2_FILTER_PARAMS = {
    'merchant': 'merchant_name__in',
    'account': 'account_id',
    'category': 'transactioncategory__category_id',
    'categories': 'transactioncategory__category_id__in',
    'limit_amount_lower': 'amount__gte',
    'limit_amount_upper': 'amount__lte',
    'type': 'account__type',
    'merchants': 'merchant_name__in',
    'accounts': 'account_id__in',
    'account': 'account_id'
}


@transaction.atomic
def sync_transactions(plaid_item: PlaidItem, default_category: Category) -> dict:
    added, modified, removed = [], [], []
    plaid_options = TransactionsSyncRequestOptions(
        include_personal_finance_category=True)

    cursor = plaid_item.cursor or ''
    has_more = True
    response_data = {'added': 0, 'modified': 0, 'removed': 0}

    def _extend_lists(response):
        '''
        Take in the plaid api response and extend the list
        of added, modified, and removed transactions which will
        eventually be flushed to the database
        '''
        for t_type in ['added', 'modified', 'removed']:
            for trans in response[t_type]:
                if t_type == 'removed':
                    removed.append(trans['transaction_id'])
                    continue

                s = PlaidTransactionSerializer(data=trans)
                s.is_valid(raise_exception=True)

                if t_type == 'added':
                    added.append(s.validated_data)
                elif t_type == 'modified':
                    modified.append(s.validated_data)

    def _bulk_add_transactions():
        Transaction.objects.bulk_create([
            Transaction(predicted_category=default_category, **t)
            if t.get('detail') == Transaction.Detail.SPENDING
            else Transaction(**t)
            for t in added
        ], ignore_conflicts=True)

    def _bulk_modify_transactions():
        for t in modified:
            transaction_id = t.pop('transaction_id')
            Transaction.objects.filter(
                transaction_id=transaction_id).update(**t)

    def _bulk_remove_transactions():
        Transaction.objects.filter(transaction_id__in=removed).delete()

    def _flush_to_db():
        _bulk_add_transactions()
        _bulk_modify_transactions()
        _bulk_remove_transactions()
        plaid_item.cursor = cursor
        plaid_item.save()

    assert (isinstance(plaid_item, PlaidItem))

    try:
        while has_more:
            request = TransactionsSyncRequest(
                access_token=plaid_item.access_token,
                cursor=cursor,
                options=plaid_options
            )
            response = plaid_client.transactions_sync(request).to_dict()

            has_more = response['has_more']
            cursor = response['next_cursor']
            _extend_lists(response)

            response_data['added'] += len(added)
            response_data['modified'] += len(modified)
            response_data['removed'] += len(removed)
            _flush_to_db()

            # reset buffers
            added, modified, removed = [], [], []
        plaid_item.last_synced = timezone.now()
        plaid_item.save()

    except plaid.ApiException as e:
        error_message = json.loads(e.body).get('error_message')
        error_code = json.loads(e.body).get('error_code')
        if error_code == 'ITEM_LOGIN_REQUIRED':
            plaid_item.login_required = True
            plaid_item.save()
        raise ValidationError(
            {'error': error_message.__str__(), 'code': error_code},
            code=HTTP_400_BAD_REQUEST
        )
    except Exception as e:  # pragma: no cover
        logger.error(e)
        # Print stack trace
        import traceback
        traceback.print_exc()
        raise ValidationError(
            {'error': 'Internal server error'},
            code=HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response_data


class TransactionsPagination(LimitOffsetPagination):
    page_size = 25
    ordering = ['-datetime', '-date']

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
            url_name='confirmation', permission_classes=[IsAuthedVerifiedSubscriber])
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
        except Transaction.DoesNotExist:  # pragma: no cover
            raise ValidationError('Transaction does not exist')

        return obj

    def get_instances(self, validated_data):
        transaction_ids = [item['transaction_id'] for item in validated_data]

        instances = Transaction.objects.filter(
            transaction_id__in=[
                id for id in transaction_ids if id is not None],
            account__useraccount__user=self.request.user
        )
        if len(instances) != len(transaction_ids):  # pragma: no cover
            raise ValidationError('Invalid transaction id provided')

        return instances

    def get_queryset(self):
        filter_args = self._exract_filter_args()

        splits_prefetch = Prefetch(
            'transactioncategory_set',
            queryset=TransactionCategory.objects.all().select_related('category'),
            to_attr='splits')

        base_qset = Transaction.objects \
            .filter(**filter_args) \
            .prefetch_related(splits_prefetch) \
            .select_related('predicted_category', 'predicted_bill', 'bill')

        # Get prefetched data for confirmed transactions query.
        if self.request.query_params.get('confirmed') == 'true':
            base_qset = base_qset.filter(
                Q(bill__isnull=False) | Q(transactioncategory__isnull=False))

        return base_qset.order_by('-date')

    @action(detail=False, methods=['get'], url_path='merchants',
            url_name='merchants', permission_classes=[IsAuthedVerifiedSubscriber])
    def merchants(self, request, *args, **kwargs):
        qset = Transaction.objects.filter(
            account__useraccount__user=self.request.user,
            merchant_name__isnull=False
        ).distinct('merchant_name').values('merchant_name').order_by('merchant_name')

        serializer = MerchantSerializer(qset, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='recurring',
            url_name='recurring', permission_classes=[IsAuthenticated])
    def recurring(self, request, *args, **kwargs):
        plaid_items = PlaidItem.objects.filter(
            user__in=self.request.user.account.users.all()
        ).prefetch_related('accounts')

        recurring_transactions = []
        for plaid_item in plaid_items:
            request = TransactionsRecurringGetRequest(
                access_token=plaid_item.access_token,
                account_ids=[
                    account.id for account in plaid_item.accounts.all()]
            )
            response = plaid_client.transactions_recurring_get(
                request).to_dict()
            recurring_transactions.extend(response['outflow_streams'])

        serializer = RecurringTransaction(
            data=recurring_transactions, many=True)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='sync', url_name='sync',
            permission_classes=[IsAuthenticated, HasObjectAccessLooseWrite])
    def sync(self, request, *args, **kwargs):
        default_category = Category.objects.filter(
            usercategory__user=self.request.user, is_default=True).first()

        plaid_items = self._get_plaid_items(request)
        sync_results = {'added': 0, 'modified': 0, 'removed': 0}
        for plaid_item in plaid_items:
            results = sync_transactions(plaid_item, default_category)
            for key, value in results.items():
                sync_results[key] += value

        return Response(sync_results, HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='count', url_name='count',
            permission_classes=[IsAuthedVerifiedSubscriber])
    def count(self, request, *args, **kwargs):
        qset = Transaction.objects.filter(**self._exract_filter_args())

        if self.request.query_params.get('confirmed') == 'true':
            qset = qset.filter(
                Q(bill__isnull=False) | Q(transactioncategory__isnull=False))

        return Response({'count': qset.count()})

    @action(detail=True, methods=['get'], url_path='notes', url_name='notes',
            permission_classes=[IsAuthedVerifiedSubscriber, IsObjectOwner])
    def notes(self, request, *args, **kwargs):
        notes = Note.objects.filter(transaction_id=kwargs['pk'])
        if notes:
            self.check_object_permissions(request, notes)
        s = NoteSerializer(notes, many=True)

        return Response(data=s.data)

    def _get_recurring_transactions(self, request):
        pass

    def _get_plaid_items(self, request):
        qset = PlaidItem.objects.filter(
            user__in=self.request.user.account.users.all())

        item_id = self.request.query_params.get('item', None)
        account_ids = self.request.query_params.getlist('accounts', [])
        account_id = self.request.query_params.get('account', None)

        if item_id:
            qset = qset.filter(id=item_id)
        if account_ids:
            qset = qset.filter(accounts__id__in=account_ids)
        if account_id:
            qset = qset.filter(accounts__id=account_id)

        try:
            for item in qset:
                self.check_object_permissions(request, item)
        except PlaidItem.DoesNotExist:
            raise ValidationError('Plaid item does not exist')

        return qset

    def _extract_date_boundaries(self) -> dict:
        params = self.request.query_params
        start = params.get('start', None)
        end = params.get('end', None)
        month = params.get('month', None)
        year = params.get('year', None)

        if month and year:
            try:
                start = datetime(int(year), int(month), 1, tzinfo=pytz.utc)
                end = start.replace(day=28) + timedelta(days=4)
                end = end - timedelta(days=end.day)
            except ValueError:  # pragma: no cover
                raise ValidationError('Invalid date format')
            return {'date__gte': start, 'date__lt': end}
        elif start and end:
            try:
                start = datetime.fromtimestamp(int(start), tz=pytz.utc).date()
                end = datetime.fromtimestamp(int(end), tz=pytz.utc).date()
            except ValueError:
                raise ValidationError('Invalid date format')
            return {'date__gte': start, 'date__lte': end}

        return {}

    def _exract_filter_args(self):
        query_params = self.request.query_params

        result = {'account__plaid_item__user__in':
                  self.request.user.account.users.all()}
        result.update(self._extract_date_boundaries())

        # If querying for unconfirmed transactions
        if query_params.get('confirmed') == 'false':
            result['bill__isnull'] = True
            result['categories'] = None

        if query_params.get('confirmed') is not None:
            # If filtering for confirmed or unconfirmed transactions
            # filter out everything that isn't spending
            result['detail'] = Transaction.Detail.SPENDING

        if 'detail' in query_params:
            result['detail'] = Transaction.Detail(
                Transaction.Detail.labels.index(query_params['detail'])
            ).value

        for key, value in query_params.items():
            if key not in QUERY_PARAMS_2_FILTER_PARAMS:
                continue
            if key == 'accounts' and isinstance(value, str):
                value = [value]
            if value == 'true':
                value = True
            elif value == 'false':
                value = False
            result[QUERY_PARAMS_2_FILTER_PARAMS[key]] = value

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
        except Note.DoesNotExist:  # pragma: no cover
            raise ValidationError('Note does not exist')
        except Exception as e:  # pragma: no cover
            logger.error(e)
            raise ValidationError(
                {'error': e.message},
                code=HTTP_400_BAD_REQUEST)

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
        Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(
            transaction=self.get_transaction(),
            user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(
            transaction=self.get_transaction(),
            user=self.request.user)
