from collections import defaultdict
from decimal import Decimal
import json
from datetime import datetime

import plaid.exceptions
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.serializers import ListSerializer
from rest_framework.exceptions import ValidationError
from django.db.models import Sum
from django.utils import timezone
from django.db.models.functions import TruncMonth, TruncYear
from plaid.model.accounts_get_request import AccountsGetRequest
import plaid

from restapi.permissions.auth import IsAuthedVerifiedSubscriber
from restapi.permissions.objects import HasObjectAccess
from core.clients import create_plaid_client
from financials.models import Account, UserAccount, Transaction
from financials.serializers.account import (
    InstitutionSerializer,
    AccountSerializer,
    UserAccountSerializer,
)

plaid_client = create_plaid_client()


class AccountsViewSet(ViewSet):
    serializer_classes = [AccountSerializer, UserAccountSerializer]
    permission_classes = [IsAuthedVerifiedSubscriber, HasObjectAccess]

    def get_serializer_class(self):
        # If data is a list and 'order' is in the list items, use UserAccountSerializer
        if isinstance(self.request.data, list) \
                and len(self.request.data) > 0 \
                and 'order' in self.request.data[0]:
            return UserAccountSerializer
        return AccountSerializer

    def get_queryset(self, serializer):
        if isinstance(serializer.child, UserAccountSerializer):
            return UserAccount.objects.filter(
                user__in=self.request.user.account.users.all()
            )
        else:
            return Account.objects.filter(
                useraccount__user__in=self.request.user.account.users.all()
            )

    def get_object(self, request):
        account = Account.objects.get(id=self.request.query_params.get('id'))
        self.check_object_permissions(request, account)

    def partial_update(self, request, *args, **kwargs):
        serializer = UserAccountSerializer(data=request.data, many=True, partial=True)
        serializer.is_valid(raise_exception=True)

        if isinstance(serializer, ListSerializer):
            to_update = self.get_queryset(serializer)
        else:
            to_update = self.get_object()

        serializer.update(to_update, serializer.validated_data)

        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='balance-history',
            url_name='balance-history')
    def balance_history(self, request, *args, **kwargs):
        '''Get the balance history for the last 6 months'''

        account_type = self.request.query_params.get('type', 'depository')
        accounts = self._get_users_accounts()

        account_balances = self._fetch_plaid_account_data(accounts)
        account_balances = {ab['account_id']: ab for ab in account_balances.values()
                            if ab['type'] == account_type}

        balance_histories = self._get_balance_history(account_balances)
        response_data = [
            {
                'account_id': account_id,
                'history': balance_history
            }
            for account_id, balance_history in balance_histories.items()
        ]

        return Response(response_data, HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        '''Get all the account data belonging to a specific user'''

        accounts = self._get_users_accounts(include_institutions=True)
        account_balances = self._fetch_plaid_account_data(accounts)

        institution_data = {
            account.institution.id: InstitutionSerializer(account.institution).data
            for account in accounts}

        return Response({
            'accounts': account_balances.values(),
            'institutions': institution_data.values(),
        }, HTTP_200_OK)

    def _get_users_accounts(self, include_institutions=False):
        qset = Account.objects.filter(
            useraccount__user__in=self.request.user.account.users.all()) \
            .order_by('useraccount__order') \
            .prefetch_related('plaid_item')

        if include_institutions:
            qset = qset.prefetch_related('institution')

        return qset

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

        except plaid.exceptions.ApiException as e:  # pragma: no cover
            error = json.loads(e.body)
            raise ValidationError({'error': {
                'code': error['error_code'],
                'message': error['error_message'],
            }})

        return account_balances

    def _get_balance_history(self, accounts_balance: dict,
                             start: int = None, end: int = None) -> dict:

        start = datetime.fromtimestamp(start).replace(tzinfo=timezone.utc) \
                if start and end else timezone.now() - timezone.timedelta(days=180)
        end = datetime.fromtimestamp(end).replace(tzinfo=timezone.utc) \
            if start and end else timezone.now()

        qset = Transaction.objects.filter(
                account__in=accounts_balance.keys(),
                date__gte=start,
                date__lte=end,
            ).annotate(month=TruncMonth('date')) \
             .annotate(year=TruncYear('date')) \
             .values('month', 'year', 'account') \
             .annotate(total=Sum('amount')) \
             .order_by('account', 'month')

        data = defaultdict(lambda: [])
        balance = Decimal(0)

        for item in qset:
            if item['account'] not in data:
                balance = Decimal(
                    accounts_balance[item['account']]['balances']['current'])
            else:
                balance += item['total']

            data[item['account']].append({
                'month': f"{item['month']}",
                'balance': balance
            })

        return data
