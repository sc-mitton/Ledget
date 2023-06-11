from django.urls import path
from .views import (
    PriceView,
    StripeHookView,
    SubscriptionView,
    OryHookView,
)

urlpatterns = [
    path('prices', PriceView.as_view(), name='prices'),
    path('subscription', SubscriptionView.as_view(), name='subscription'),
    path('stripe', StripeHookView.as_view(), name='stripe_hook'),
    path('ory', OryHookView.as_view(), name='ory_hook'),
]
