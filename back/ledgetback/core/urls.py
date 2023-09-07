from django.urls import path, include
from .views.user import (
     UserView,
     GetPaymentMethodsView
)
from .views.service import (
    PriceView,
    CreateSubscriptionView,
    CreateCustomerView,
    GetSetupIntent
)


urlpatterns = [
     path('prices', PriceView.as_view(), name='prices'),
     path('user/me', UserView.as_view(), name='get_me'),
     path('user/<uuid:id>', UserView.as_view(), name='update_user'),

     path('payment_methods', GetPaymentMethodsView.as_view(), name='payment_methods'), # noqa
     path('customer', CreateCustomerView.as_view(), name='customer'),
     path('subscription', CreateSubscriptionView.as_view(), name='subscription'), # noqa
     path('setup_intent', GetSetupIntent.as_view(), name='setup_intent'), # noqa

     path('', include('budget.urls')),
     path('', include('financials.urls')),
]
