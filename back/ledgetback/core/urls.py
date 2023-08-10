from django.urls import path
from .views.user import (
     UserView,
     PaymentMethodView
)
from .views.service import (
    PriceView,
    SubscriptionView,
    CustomerView
)
from .views.plaid_link import (
     PlaidLinkTokenView,
     PlaidTokenExchangeView
)

urlpatterns = [
    path('prices', PriceView.as_view(), name='prices'),
    path('user/me', UserView.as_view(), name='user'),
    path('user/<str:user_id>/customer',
         CustomerView.as_view(), name='customer'),
    path('user/<str:user_id>/subscription',
         SubscriptionView.as_view(), name='subscription'),
    path('user/<str:user_id>/payment_method', PaymentMethodView.as_view(),
         name='payment_method'),
    path('plaid_link_token', PlaidLinkTokenView.as_view(),
         name='plaid_link_token'),
    path('plaid_token_exchange', PlaidTokenExchangeView.as_view(),
         name='plaid_token_exchange'),
]
