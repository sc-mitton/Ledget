from django.urls import path

from financials.views import (
     PlaidTokenExchangeView,
     PlaidItemsListView,
     DestroyPlaidItemView,
     PlaidLinkTokenView
)


urlpatterns = [
    path('plaid_items', PlaidItemsListView.as_view(), name='plaid_item'),
    path('plaid_item/<str:item_id>', DestroyPlaidItemView.as_view(), name='destroy_plaid_item'), # noqa
    path('plaid_link_token', PlaidLinkTokenView.as_view(), name='plaid_link_token'), # noqa
    path('plaid_token_exchange', PlaidTokenExchangeView.as_view(), name='plaid_token_exchange'), # noqa
]
