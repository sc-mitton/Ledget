from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.db.models import Prefetch
from plaid.model.investments_holdings_get_request import InvestmentsHoldingsGetRequest
from plaid.model.investments_transactions_get_request import InvestmentsTransactionsGetRequest
from plaid.model.investments_transactions_get_request_options import InvestmentsTransactionsGetRequestOptions
from plaid.model_utils import date
import plaid
import json

from financials.serializers.investments import InvestmentsSerializer
from financials.models import PlaidItem, Account
from core.clients import create_plaid_client
from restapi.permissions.auth import IsAuthedVerifiedSubscriber

plaid_client = create_plaid_client()


class InvestmentsView(GenericAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]

    def list(self, request):

        prefetch = Prefetch(
            'accounts',
            queryset=Account.objects.filter(
                type__in=['investment']))
        plaid_items = PlaidItem.objects.filter(
            user__in=request.user.account.users.all()) \
            .prefetch_related(prefetch)


        return Response()

    def _get_plaid_data(self, plaid_item):
        return


# request = InvestmentsTransactionsGetRequest(
#     access_token=p.access_token,
#     start_date=date.fromisoformat('2023-03-01'),
#     end_date=date.fromisoformat('2024-04-30'),
#     options=InvestmentsTransactionsGetRequestOptions(
#         account_ids=[p.accounts.all()[0].id]
#     )
# )
