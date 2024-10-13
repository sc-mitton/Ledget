from itertools import groupby
from datetime import timedelta
import json

from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.db.models import Prefetch
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

from financials.serializers.investments import InvestmentsSerializer
from financials.models import PlaidItem, Account
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

        results = []
        for item in plaid_items:
            try:
                plaid_data = self._get_plaid_transactions_data(
                    item,
                    kwargs.get('start', date.today()) - timedelta(days=30),
                    kwargs.get('end', date.today())
                )
            except plaid.ApiException as e:
                if json.loads(e.body)['error_code'] == 'PRODUCT_NOT_SUPPORTED':
                    continue
                else:
                    raise e
            else:
                results.extend(plaid_data)

        return Response()

    def _get_plaid_transactions_data(self, plaid_item, start, end):

        account_ids = [a.id for a in plaid_item.accounts.all()]
        holdings_request = InvestmentsHoldingsGetRequest(
            access_token=plaid_item.access_token,
            options=InvestmentHoldingsGetRequestOptions(
                account_ids=account_ids))
        holdings_response = plaid_client.investments_holdings_get(holdings_request)

        holdings = groupby(
            holdings_response.to_dict()['holdings'], lambda x: x['account_id'])
        balances = holdings_response.to_dict()['accounts']
        transactions = self._get_transactions_plaid_data(plaid_item, start, end)

        serialized_data = []
        for (account_id, transaction_group), (_, holding_group), balances \
                in zip(transactions, holdings, balances):

            serializer = InvestmentsSerializer(
                data={
                    'account_id': account_id,
                    'holdings': list(holding_group),
                    'transactions': list(transaction_group),
                    'securities': holdings_response.to_dict()['securities'],
                    'balance': balances['balances']['current']
                }
            )
            serializer.is_valid(raise_exception=True)
            serialized_data.append(serializer.data)

        return serialized_data

    def _get_transactions_plaid_data(plaid_item, start, end):
        '''
        Concatenates all of the transactions for the paginated responses
        '''

        account_ids = [a.id for a in plaid_item.accounts.all()]

        transactions_request = InvestmentsTransactionsGetRequest(
            access_token=plaid_item.access_token,
            start_date=start,
            end_date=end,
            options=InvestmentsTransactionsGetRequestOptions(
                account_ids=account_ids))
        response = plaid_client.investments_transactions_get(
            transactions_request)
        investment_transactions = response['investment_transactions']

        transactions = response['investment_transactions']

        while len(investment_transactions) < response['total_investment_transactions']:
            transactions_request = InvestmentsTransactionsGetRequest(
                access_token=plaid_item.access_token,
                start_date=start,
                end_date=end,
                options=InvestmentsTransactionsGetRequestOptions(
                    account_ids=account_ids))
            response = plaid_client.investments_transactions_get(
                transactions_request)
            transactions.extend(response['investment_transactions'])

        return groupby(transactions, lambda x: x['account_id'])
