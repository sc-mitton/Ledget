from django.urls import path
from .views import (
    PriceView,
    StripeHookView
)

urlpatterns = [
    path('prices', PriceView.as_view(), name='prices'),
    path('stripe-hook', StripeHookView.as_view(), name='stripe_hook'),
]
