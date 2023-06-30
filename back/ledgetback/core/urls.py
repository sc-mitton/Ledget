from django.urls import path
from .views import (
    PriceView,
    SubscriptionView,
    CustomerCreateView
)

urlpatterns = [
    path('prices', PriceView.as_view(), name='prices'),
    path('user/<str:user_id>/customer',
         CustomerCreateView.as_view(), name='customer'),
    path('user/<str:user_id>/subscription',
         SubscriptionView.as_view(), name='subscription'),
]
