from django.urls import path
from .views import (
    PriceView,
    SubscriptionView,
)

urlpatterns = [
    path('prices', PriceView.as_view(), name='prices'),
    path('user/<str:user_id>/subscription',
         SubscriptionView.as_view(), name='subscription'),
]
