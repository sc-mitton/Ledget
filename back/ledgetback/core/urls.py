from django.urls import path, include
from .views.user import UserView
from .views.service import (
    PriceView,
    SubscriptionView,
    UpateSubscriptionView,
    CreateCustomerView,
    GetSetupIntent,
    PaymentMethodView,
    SubscriptionItemsView,
    NextInvoice
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
     path('subscription/<str:sub_id>', UpateSubscriptionView.as_view()),
     path('subscription_item', SubscriptionItemsView.as_view(),
          name='subscription_item'),
     path('setup_intent', GetSetupIntent.as_view(),
          name='setup_intent'),

     path('next_invoice', NextInvoice.as_view(), name='next_invoice'),

     path('', include('budget.urls')),
     path('', include('financials.urls')),
]
