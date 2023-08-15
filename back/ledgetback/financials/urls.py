from django.urls import path

from financials.views import (
    TransactionsSyncView
)
from financials.views import (
     PlaidTokenExchangeView,
     PlaidItemsListView
)


urlpatterns = [
    path('transactions/sync', TransactionsSyncView.as_view(), name='sync'),
    path('plaid_items', PlaidItemsListView.as_view(), name='plaid_items'),
    path('plaid_token_exchange',
         PlaidTokenExchangeView.as_view(),
         name='plaid_token_exchange'),
]
