from decimal import Decimal
import math
import json
from datetime import datetime, date
from itertools import groupby
from dateutil import relativedelta
from typing import List

import plaid.exceptions
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.exceptions import ValidationError
from django.db.models import Sum, F
from django.utils import timezone
from django.db.models.functions import TruncMonth, TruncYear
from plaid.model.accounts_get_request import AccountsGetRequest
import plaid

from restapi.permissions.auth import IsAuthedVerifiedSubscriber
from restapi.permissions.objects import HasObjectAccess
from restapi.utils import months_between
from core.clients import create_plaid_client
from financials.models import Account, UserAccount, Transaction
from financials.serializers.account import (
    InstitutionSerializer,
    UserAccountSerializer,
    AccountSerializer,
    PlaidBalanceSerializer,
    BreakdownHistorySerializer
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
                user__in=self.request.user.account.users.all())
        else:
            return Account.objects.filter(
                useraccount__user__in=self.request.user.account.users.all())

    def get_object(self, request):
        obj_id = self.request.query_params.get('id')
        account = Account.objects.get(id=obj_id)
        self.check_object_permissions(request, account)

    def partial_update(self, request, *args, **kwargs):
        serializer = UserAccountSerializer(
            data=request.data,
            many=True,
            partial=True)
        serializer.is_valid(raise_exception=True)
        to_update = self.get_queryset(serializer)

        serializer.update(to_update, serializer.validated_data)

        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='breakdown-history')
    def breakdown_history(self, response, *args, **kwargs):
        '''Get the breakdown over all the accounts (spending, income, investments)'''

        qset = Transaction.objects.filter(
            account__useraccount__user__in=self.request.user.account.users.all(),
            detail__isnull=False
        ).annotate(month=TruncMonth('date')) \
         .annotate(year=TruncYear('date')) \
         .values('month', 'year', 'detail') \
         .annotate(total=Sum('amount'))

        s = BreakdownHistorySerializer(qset, many=True)

        return Response(data=s.data)

    @action(detail=False, methods=['get'], url_path='balance-history',
            url_name='balance-history')
    def balance_history(self, request, *args, **kwargs):
        '''Get the balance history for the last 6 months'''

        account_type = self.request.query_params.get('type', 'depository')
        accounts = self._get_users_accounts()

        account_balances = self._fetch_plaid_account_data(accounts)
        account_balances = {ab['account_id']: ab for ab in account_balances.values()
                            if ab['type'] == account_type}

        start = int(self.request.query_params.get('start')) or None
        end = int(self.request.query_params.get('end')) or None
        balance_histories = self._get_balance_history(account_balances, start, end)
        response_data = [
            {
                'account_id': account_id,
                'history': balance_history
            }
            for account_id, balance_history in balance_histories.items()
        ]

        return Response(response_data, HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='balance-trend',
            url_name='balance-trend')
    def balance_trend(self, request, *args, **kwargs):
        '''Get the balance trend for the last 30 days'''

        account_type = self.request.query_params.get('type', 'depository')
        days = self.request.query_params.get('days', 30)

        accounts = [
            a.id for a in self._get_users_accounts()
            if a.type == account_type
        ]

        trends = self._get_balance_trend(accounts, days)
        response_data = {'days': days, 'trends': trends}

        return Response(response_data, HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        '''Get all the account data belonging to a specific user'''

        accounts = self._get_users_accounts(include_institutions=True)
        balance_data = self._fetch_plaid_account_data(accounts)
        accounts_data = AccountSerializer(accounts, many=True).data
        accounts_data = [
            {**a, **balance_data.get(a['id'], {})}
            for a in accounts_data
        ]

        institution_data = {
            account.institution.id: InstitutionSerializer(account.institution).data
            for account in accounts
        }

        return Response({
            'accounts': accounts_data,
            'institutions': institution_data.values(),
        }, HTTP_200_OK)

    def _get_users_accounts(self, include_institutions=False):

        qset = Account.objects.filter(
                useraccount__user__in=self.request.user.account.users.all()
            ).annotate(order=F('useraccount__order')) \
            .annotate(pinned=F('useraccount__pinned')) \
            .annotate(card_hue=F('useraccount__card_hue'))

        account_ids = self.request.query_params.getlist('accounts')
        if account_ids and account_ids[0] != '*':
            qset = qset.filter(id__in=account_ids)

        type = self.request.query_params.get('type')
        if type:
            qset = qset.filter(type=type)

        qset = qset.order_by('useraccount__order').prefetch_related('plaid_item')

        if include_institutions:
            qset = qset.prefetch_related('institution')

        return qset

    def _fetch_plaid_account_data(self, accounts: List[Account]) -> dict:
        already_fetched_tokens = []

        data = {a.id: None for a in accounts}
        for account in accounts:

            if account.plaid_item.access_token in already_fetched_tokens:
                continue
            request = AccountsGetRequest(
                access_token=account.plaid_item.access_token)

            try:
                response = plaid_client.accounts_get(request).to_dict()
                for a in response['accounts']:
                    balance_data_serializer = PlaidBalanceSerializer(data=a)
                    balance_data_serializer.is_valid(raise_exception=True)
                    data[a['account_id']] = {
                        **balance_data_serializer.validated_data,
                        'institution_id': account.institution.id
                    }
                already_fetched_tokens.append(account.plaid_item.access_token)

            except plaid.exceptions.ApiException as e:  # pragma: no cover
                error = json.loads(e.body)
                if error.get('error_code') == 'ITEM_LOGIN_REQUIRED':
                    account.plaid_item.login_required = True
                    account.plaid_item.save()
                raise ValidationError({'error': {
                    'code': error['error_code'],
                    'message': error['error_message'],
                }})

        return data

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
             .order_by('account', '-month')
        grouped_qset = groupby(qset, key=lambda x: x['account'])

        result = {
            a['account_id']: [{
                'month': date.today(),
                'balance': Decimal(a['balances']['current'])
            }]
            for a in accounts_balance.values()
        }

        for account_id, data in grouped_qset:
            listed_data = list(data)

            # note: month_data steps backwards in time
            # 2020-07-01, 2020-06-01, 2020-05-01, ...
            for month_data in listed_data:

                months_delta = months_between(
                    month_data['month'],
                    result[account_id][-1]['month'],
                    1
                )
                months_delta = max(1, math.ceil(months_delta))

                # If there's more than a 1 month gap between the last point and
                # the current, fill in the gap with the last point
                # Example:
                # result[account_id] = [{month: 2020-07-01, balance: 100}]
                # point = 200, month_data['month'] = 2020-05-01, delta = 2
                # new_points =
                # [{month: 2020-06-01, balance: 100}, {month: 2020-05-01, balance: 200}]
                back_fill = [{
                    'month': result[account_id][-1]['month'].replace(day=1) -
                    relativedelta.relativedelta(months=j),
                    'balance': result[account_id][-1]['balance']
                } for j in range(months_delta - 1)]

                result[account_id].extend(back_fill)

                # Append new point
                result[account_id].append({
                    'month': month_data['month'].replace(day=1),
                    'balance': result[account_id][-1]['balance'] + month_data['total']
                })

        # Backfill the end for each account if it ends before
        # window start by repeating the last balance
        num_data_points = math.ceil(months_between(start, end, 1)) + 1
        for account_id in result.keys():
            iter_start = 0 if result[account_id][-1]['month'].day > 0 else 1
            num_missing_points = max(
                0, num_data_points - len(result[account_id])) + iter_start
            extended_data = [
                {
                    'month': result[account_id][-1]['month'].replace(day=1)
                    - relativedelta.relativedelta(months=j),
                    'balance': result[account_id][-1]['balance']
                }
                for j in range(iter_start, num_missing_points, 1)
            ]
            result[account_id].extend(extended_data)

        return result

    def _get_balance_trend(self, accounts: list, days: int):

        start = datetime.now() - timezone.timedelta(days=days)
        end = datetime.now()

        qset = Transaction.objects.filter(
            account__in=accounts,
            date__gte=start,
            date__lte=end,
        ).values('account') \
         .annotate(total=Sum('amount')) \
         .order_by('account')

        data = []
        for item in qset:
            data.append({
                'account': item['account'],
                'trend': item['total'] * -1
            })

        return data
