import logging
import json

from celery import shared_task, group
from django.db import OperationalError
from django.db.models import Subquery, Max, Q
from django.utils import timezone
from plaid.model.investments_holdings_get_request import InvestmentsHoldingsGetRequest
from plaid.model.investment_holdings_get_request_options import (
    InvestmentHoldingsGetRequestOptions
)
from core.clients import create_plaid_client
import plaid

from financials.models import PlaidItem, AccountBalance, Account

logger = logging.getLogger('ledget')
plaid_client = create_plaid_client()


@shared_task(auto_retry_for=(OperationalError), retry_backoff=10, retry_jitter=True,
             retry_kwargs={'max_retries': 3})
def fetch_balences(item_ids=[], account_ids=[], access_tokens=[]) -> None:

    if (len(account_ids) != len(access_tokens)):
        logger.error(
            'fetch_balences: account_ids and access_tokens are not the same length')
        raise ValueError('account_ids and access_tokens are not the same length')

    balance_objects = []
    investments_not_supported = []
    for i in range(len(account_ids)):
        request = InvestmentsHoldingsGetRequest(
            access_token=access_tokens[i],
            options=InvestmentHoldingsGetRequestOptions(account_ids=account_ids[i]))
        try:
            response = plaid_client.investments_holdings_get(request)
        except plaid.ApiException as e:
            if json.loads(e.body)['error_code'] == 'PRODUCT_NOT_SUPPORTED':
                investments_not_supported.append(item_ids[i])
        else:
            balance_objects.extend([
                AccountBalance(
                    date=timezone.now().date(),
                    account_id=a.account_id,
                    value=a.balances.current
                )
                for a in response.accounts
            ])

    if investments_not_supported:
        PlaidItem.objects.filter(id__in=investments_not_supported).update(
            investments_supported=False)

    AccountBalance.objects.bulk_create(balance_objects)


@shared_task(auto_retry_for=(OperationalError), retry_backoff=10, retry_jitter=True,
             retry_kwargs={'max_retries': 3})
def fetch_investments_balance() -> None:
    '''
    Fetch investments balance data for all of the investment accounts in the db
    '''

    # Fetch all of the plaid items that don't have a balance for today
    plaid_items = PlaidItem.objects.filter(
        investments_supported=True,
        accounts__id__in=Subquery(
            Account.objects
            .values('id')
            .annotate(max_date=Max('balances__date'))
            .filter(Q(max_date__lt=timezone.now().date()) | Q(max_date=None))
            .values('id')
        )
    ).prefetch_related('accounts')

    batch_size = 1000
    tasks = []
    for i in range(0, len(plaid_items), batch_size):
        batch = plaid_items[i:i+batch_size]
        task = fetch_balences.si(
            account_ids=[[a.id for a in item.accounts.all()] for item in batch],
            access_tokens=[item.access_token for item in batch],
            kwargsrepr=repr({'access_tokens': '**REDACTED**[]'})
        ).apply_async()
        tasks.append(task)

    if tasks:
        tasks_group = group(tasks)
        tasks_group()
