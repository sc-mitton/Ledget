from dateutil.relativedelta import relativedelta
from collections import defaultdict
from decimal import Decimal
import json

import plaid.exceptions
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.serializers import ListSerializer
from rest_framework.exceptions import ValidationError
from django.db.models import Sum
from django.utils import timezone
from django.db.models.functions import TruncMonth
from plaid.model.accounts_get_request import AccountsGetRequest
import plaid

from restapi.permissions.auth import IsAuthedVerifiedSubscriber
from restapi.permissions.objects import HasObjectAccess
from core.clients import create_plaid_client
from core.models import User
from financials.models import Account, UserAccount, Transaction
from financials.serializers.account import (
    InstitutionSerializer,
    AccountSerializer,
    UserAccountSerializer,
)

plaid_client = create_plaid_client()


class AccountsView(GenericAPIView):
    serializer_classes = [AccountSerializer, UserAccountSerializer]
    permission_classes = [IsAuthedVerifiedSubscriber, HasObjectAccess]

    def get_serializer_class(self):
        # If data is a list and 'order' is in the list items, use UserAccountSerializer
        if isinstance(self.request.data, list) \
                and len(self.request.data) > 0 \
                and 'order' in self.request.data[0]:
            return UserAccountSerializer
        return AccountSerializer

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self, serializer):
        if isinstance(serializer.child, UserAccountSerializer):
            return UserAccount.objects.filter(
                user_id__in=self.request.user.account_user_ids
            )
        else:
            return Account.objects.filter(
                useraccount__user_id__in=self.request.user.account_user_ids
            )

    def get_object(self, request):
        account = Account.objects.get(id=self.request.query_params.get('id'))
        self.check_object_permissions(request, account)

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if isinstance(serializer, ListSerializer):
            to_update = self.get_queryset(serializer)
        else:
            to_update = self.get_object()

        serializer.update(to_update, serializer.validated_data)

        return Response(serializer.data)

    def get(self, request, *args, **kwargs):
        '''Get all the account data belonging to a specific user'''

        accounts = Account.objects.filter(useraccount__user_id__in= \
                                        self.request.user.account_user_ids) \
                                  .order_by('useraccount__order') \
                                  .prefetch_related('plaid_item') \
                                  .prefetch_related('institution')

        account_balances = self._fetch_plaid_account_data(accounts)

        balance_history = self._get_balance_history({
            k: account_balances[k]['balances']['current'] for k in account_balances})

        for account_id in balance_history:
            account_balances[account_id]['balance_history'] = \
                balance_history[account_id]

        institution_data = {
            account.institution.id: InstitutionSerializer(account.institution).data
            for account in accounts}

        return Response({
            'accounts': account_balances.values(),
            'institutions': institution_data.values(),
        }, HTTP_200_OK)

    def _fetch_plaid_account_data(self, accounts: list) -> dict:
        already_fetched_tokens = []

        account_balances = {}
        try:
            for account in accounts:
                if account.plaid_item.access_token in already_fetched_tokens:
                    continue

                request = AccountsGetRequest(
                    access_token=account.plaid_item.access_token)

                response = plaid_client.accounts_get(request).to_dict()
                for a in response['accounts']:
                    account_balances.update({a['account_id']: {
                        **a, 'institution_id': account.institution.id,
                    }})
                already_fetched_tokens.append(account.plaid_item.access_token)

        except plaid.exceptions.ApiException as e:
            error = json.loads(e.body)
            raise ValidationError({'error': {
                'code': error['error_code'],
                'message': error['error_message'],
            }})

        return account_balances

    def _get_balance_history(self, accounts_balance: dict) -> dict:

        qset = Transaction.objects.filter(
                account__in=accounts_balance.keys(),
                date__gte=timezone.now().replace(day=1) - relativedelta(months=5),
                date__lte=timezone.now().replace(day=1)
            ).annotate(month=TruncMonth('date')) \
             .values('month', 'account') \
             .annotate(total=Sum('amount')) \
             .order_by('account', 'month')

        data = defaultdict(lambda: [])
        balance = Decimal(0)
        for item in qset:
            if item['account'] not in data:
                balance = Decimal(accounts_balance[item['account']])
            else:
                balance += item['total']

            data[item['account']].append({
                'month': item['month'],
                'balance': balance
            })

        return data
