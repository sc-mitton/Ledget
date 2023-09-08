from django.urls import path, include
from .views.user import UserView
from .views.service import (
    PriceView,
    SubscriptionView,
    CreateCustomerView,
    GetSetupIntent,
    PaymentMethodView
)


urlpatterns = [
     path('prices', PriceView.as_view(), name='prices'),
     path('user/me', UserView.as_view(), name='get_me'),
     path('user/<uuid:id>', UserView.as_view(), name='update_user'),

     path('default_payment_method', PaymentMethodView.as_view(),
          name='default_payment_method'),
     path('customer', CreateCustomerView.as_view(), name='customer'),
     path('subscription', SubscriptionView.as_view(),
          name='subscription'),
     path('setup_intent', GetSetupIntent.as_view(),
          name='setup_intent'),

     path('', include('budget.urls')),
     path('', include('financials.urls')),
]
