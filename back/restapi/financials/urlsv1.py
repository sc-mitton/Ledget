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
    path('plaid_items', PlaidItemsListView.as_view(), name='plaid-item'),
    path('plaid_item/<str:id>', PlaidItemView.as_view(), name='plaid-item-destroy'), # noqa
    path('plaid_link_token', PlaidLinkTokenView.as_view(), name='plaid-link-token'),
    path('plaid_link_token/<str:id>', PlaidLinkTokenView.as_view(), name='plaid-update-link-token'), # noqa
    path('plaid_token_exchange', PlaidTokenExchangeView.as_view(), name='plaid-token-exchange'), # noqa
    path('accounts', AccountsView.as_view(), name='account'),
    path('', include(transactions_router.urls)),
    path('transactions/<str:id>/', include(note_router.urls)),
]
