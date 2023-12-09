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
    TransactionsSyncView,
    TransactionViewSet,
    NoteViewSet
)
from financials.views.account import AccountsView


class TransactionsCategoriesRouter(SimpleRouter):

    routes = [
        Route(
            url=r'^{prefix}$',
            mapping={'get': 'list', 'post': 'partial_update'},
            name='{basename}-list',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),
        Route(
            url=r'^{prefix}/{lookup}$',
            mapping={'patch': 'partial_update'},
            name='{basename}-detail',
            detail=True,
            initkwargs={'suffix': 'Detail'}
        ),
        DynamicRoute(
            url=r'^{prefix}/{url_path}$',
            name='{basename}-{url_name}}',
            detail=False,
            initkwargs={}
        ),
    ]


transactions_router = SimpleRouter(trailing_slash=False)
transactions_router.register(
    'transactions', TransactionViewSet, basename='transactions')

note_router = SimpleRouter(trailing_slash=False)
note_router.register('note', NoteViewSet, basename='note')

urlpatterns = [
    path('plaid_items', PlaidItemsListView.as_view(), name='plaid_item'),
    path('plaid_item/<str:id>', PlaidItemView.as_view(), name='destroy_plaid_item'), # noqa
    path('plaid_link_token', PlaidLinkTokenView.as_view(), name='plaid_link_token'),
    path('plaid_link_token/<str:id>', PlaidLinkTokenView.as_view(), name='plaid_update_link_token'), # noqa
    path('plaid_token_exchange', PlaidTokenExchangeView.as_view(), name='plaid_token_exchange'), # noqa
    path('accounts', AccountsView.as_view(), name='account'),
    path('', include(transactions_router.urls)),
    path('transactions/sync', TransactionsSyncView.as_view(), name='transactions_sync'),
    path('transactions/<str:id>/', include(note_router.urls)),
]
