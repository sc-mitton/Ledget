from django.urls import path

from financials.views.items import (
     PlaidTokenExchangeView,
     PlaidItemsListView,
     PlaidItemView,
     PlaidLinkTokenView
)
from financials.views.transactions import TransactionsSyncView
from financials.views.account import AccountsView


urlpatterns = [
    path('plaid_items', PlaidItemsListView.as_view(), name='plaid_item'),
    path('plaid_item/<str:item_id>', PlaidItemView.as_view(), name='destroy_plaid_item'), # noqa
    path('plaid_link_token', PlaidLinkTokenView.as_view(), name='plaid_link_token'),
    path('plaid_link_token/<str:item_id>', PlaidLinkTokenView.as_view(), name='plaid_update_link_token'), # noqa
    path('plaid_token_exchange', PlaidTokenExchangeView.as_view(), name='plaid_token_exchange'), # noqa
    path('transactions/sync', TransactionsSyncView.as_view(), name='transactions_sync'),
    path('accounts', AccountsView.as_view(), name='account'),
]
