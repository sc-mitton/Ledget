from django.urls import path
from rest_framework.routers import SimpleRouter, Route, DynamicRoute
from django.urls import include

from financials.views.items import (
     PlaidTokenExchangeView,
     PlaidItemsListView,
     PlaidItemView,
     PlaidLinkTokenView
)
from financials.views.transactions import (
    TransactionViewSet,
    NoteViewSet
)
from financials.views.liabilities import LiabilitiesView
from financials.views.investments import (
    InvestmentsView,
    InvestmentsBalanceHistoryView,
    HoldingPinViewset
)
from financials.views.account import AccountsViewSet


class AccountsRouter(SimpleRouter):

    routes = [
        Route(
            url=r'^{prefix}$',
            mapping={'get': 'list', 'patch': 'partial_update'},
            name='{basename}-list',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),
        Route(
            url=r'^{prefix}/{lookup}$',
            mapping={'get': 'retrieve'},
            name='{basename}-detail',
            detail=True,
            initkwargs={'suffix': 'Detail'}
        ),
        DynamicRoute(
            url=r'^{prefix}/{url_path}$',
            name='{basename}-{url_name}',
            detail=False,
            initkwargs={}
        ),
    ]


transactions_router = SimpleRouter(trailing_slash=False)
transactions_router.register(
    'transactions', TransactionViewSet, basename='transactions')

note_router = SimpleRouter(trailing_slash=False)
note_router.register('note', NoteViewSet, basename='note')

accounts_router = AccountsRouter(trailing_slash=False)
accounts_router.register('accounts', AccountsViewSet, basename='accounts')

holding_pin_router = SimpleRouter(trailing_slash=False)
holding_pin_router.register('holding-pin', HoldingPinViewset, basename='holding-pin')

urlpatterns = [
    path('plaid-items', PlaidItemsListView.as_view(), name='plaid-item'),
    path('plaid-item/<str:id>', PlaidItemView.as_view(), name='plaid-item-detail'), # noqa
    path('plaid-link-token', PlaidLinkTokenView.as_view(), name='plaid-link-token'),
    path('plaid-link-token/<str:id>', PlaidLinkTokenView.as_view(), name='plaid-update-link-token'), # noqa
    path('plaid-token-exchange', PlaidTokenExchangeView.as_view(), name='plaid-token-exchange'), # noqa
    path('', include(accounts_router.urls)),
    path('', include(transactions_router.urls)),
    path('', include(holding_pin_router.urls)),
    path('transactions/<str:id>/', include(note_router.urls)),
    path('liabilities', LiabilitiesView.as_view(), name='liabilities'),
    path('investments', InvestmentsView.as_view(), name='investments'),
    path('investments/balance-history', InvestmentsBalanceHistoryView.as_view(),
         name='investments-balance-history')
]
