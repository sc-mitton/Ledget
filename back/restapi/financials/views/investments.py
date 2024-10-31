from itertools import groupby
from datetime import timedelta
from datetime import datetime
from dateutil import parser
import json
import base64

from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch
from django.utils import timezone
from plaid.model.investments_holdings_get_request import InvestmentsHoldingsGetRequest
from plaid.model.investments_transactions_get_request_options import (
    InvestmentsTransactionsGetRequestOptions
)
from plaid.model.investments_transactions_get_request import (
    InvestmentsTransactionsGetRequest
)
from plaid.model.investment_holdings_get_request_options import (
    InvestmentHoldingsGetRequestOptions
)
from plaid.model_utils import date
import plaid

from financials.serializers.investments import (
    InvestmentSerializer,
    InvestmentBalanceSerializer
)
from financials.models import PlaidItem, Account, AccountBalance
from core.clients import create_plaid_client
from restapi.permissions.auth import IsAuthedVerifiedSubscriber

plaid_client = create_plaid_client()


class InvestmentsView(GenericAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]

    def get(self, request, *args, **kwargs):

        prefetch = Prefetch(
            'accounts',
            queryset=Account.objects.filter(
                type__in=['investment']))
        plaid_items = PlaidItem.objects.filter(
                investments_supported=True,
                user__in=request.user.account.users.all()) \
            .prefetch_related(prefetch)

        offsets = base64.b64decode(kwargs.get('cursor', '{}')) or {}
        results = []

        for item in plaid_items:
            try:
                plaid_data, offset = self._get_plaid_transactions_data(
                    item,
                    kwargs.get('start', date.today()) - timedelta(days=30),
                    kwargs.get('end', date.today()),
                    offset=offsets.get(item.id, None)
                )
                if offset:
                    offsets[item.id] = offset
            except plaid.ApiException as e:
                if json.loads(e.body)['error_code'] == 'PRODUCTS_NOT_SUPPORTED':
                    s = InvestmentSerializer(data={
                        'account_id': item.accounts.first().id,
                        'product_not_supported': True
                    })
                    s.is_valid(raise_exception=True)
                    results.append(s.data)
                else:
                    raise e
            else:
                results.extend(plaid_data)

        payload = {'results': results}

        if offsets:
            payload['cursor'] = base64.b64encode(json.dumps(offsets))

        return Response(payload, status=status.HTTP_200_OK)

    def _get_plaid_transactions_data(self, plaid_item, start, end, offset=None):

        account_ids = [a.id for a in plaid_item.accounts.all()]
        account_names = [a.name for a in plaid_item.accounts.all()]

        holdings_request = InvestmentsHoldingsGetRequest(
            access_token=plaid_item.access_token,
            options=InvestmentHoldingsGetRequestOptions(
                account_ids=account_ids))
        holdings_response = plaid_client.investments_holdings_get(holdings_request)
        holdings = groupby(
            holdings_response.to_dict()['holdings'], lambda x: x['account_id'])
        balances = holdings_response.to_dict()['accounts']
        transactions, offset = self._get_transactions_plaid_data(
            plaid_item, start, end, offset)

        serialized_data = []
        for (account_id, transaction_group), (_, holding_group), balances \
                in zip(transactions, holdings, balances):

            if account_id not in account_ids:
                continue

            serializer = InvestmentSerializer(
                data={
                    'account_id': account_id,
                    'account_name': account_names[account_ids.index(account_id)],
                    'holdings': list(holding_group),
                    'transactions': list(transaction_group),
                    'securities': holdings_response.to_dict()['securities'],
                    'balance': balances['balances']['current']
                }
            )
            serializer.is_valid(raise_exception=True)
            serialized_data.append(serializer.data)

        return serialized_data, offset

    def _get_transactions_plaid_data(self, plaid_item, start, end, offset=None):
        '''
        Concatenates all of the transactions for the paginated responses
        '''

        account_ids = [a.id for a in plaid_item.accounts.all()]

        optionArgs = {'account_ids': account_ids}
        if (offset):
            optionArgs['offset'] = offset

        transactions_request = InvestmentsTransactionsGetRequest(
            access_token=plaid_item.access_token,
            start_date=start,
            end_date=end,
            options=InvestmentsTransactionsGetRequestOptions(**optionArgs))
        response = plaid_client.investments_transactions_get(
            transactions_request).to_dict()

        investment_transactions = response['investment_transactions']
        total_investment_transactions = response['total_investment_transactions']

        offset = offset + len(investment_transactions) \
            if offset \
            else len(investment_transactions)

        if len(investment_transactions) + offset < total_investment_transactions:
            return groupby(investment_transactions, lambda x: x['account_id']), offset
        else:
            return groupby(investment_transactions, lambda x: x['account_id']), None


class InvestmentsBalanceHistoryView(ListAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = InvestmentBalanceSerializer

    def get_queryset(self, *args, **kwargs):
        start = self.request.query_params.get('start', None)
        end = self.request.query_params.get('end', None)
        start = parser.parse(start) if start else datetime.now() - timedelta(days=30)
        end = parser.parse(end) if end else datetime.now()
        start.replace(tzinfo=timezone.utc)
        end.replace(tzinfo=timezone.utc)

        qset = AccountBalance.objects.filter(
            account__plaid_item__user__in=self.request.user.account.users.all(),
            date__gte=start,
            date__lte=end
        ).prefetch_related('account')

        return qset
