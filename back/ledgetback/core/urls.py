from django.urls import path, include
from .views.user import (
     UserView,
     PaymentMethodView
)
from .views.service import (
    PriceView,
    SubscriptionView,
    CustomerView
)
from .views.plaid_link import PlaidLinkTokenView


urlpatterns = [
     path('prices', PriceView.as_view(), name='prices'),

     path('user/me', UserView.as_view(), name='user'),
     path('user/<str:user_id>/customer',
          CustomerView.as_view(), name='customer'),
     path('user/<str:user_id>/subscription',
          SubscriptionView.as_view(), name='subscription'),
     path('user/<str:user_id>/payment_method', PaymentMethodView.as_view(),
          name='payment_method'),
     path('user/<str:user_id>/', include('budget.urls')),
     path('user/<str:user_id>/', include('financials.urls')),

     path('plaid_link_token', PlaidLinkTokenView.as_view(),
          name='plaid_link_token'),
]
