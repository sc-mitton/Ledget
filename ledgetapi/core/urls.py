from django.urls import path
from .checkout_views import (
    PriceView,
    StripeHookView,
    SubscriptionView,
    CreateCustomerView
)

urlpatterns = [
    path('prices', PriceView.as_view(), name='prices'),
    path('subscription', SubscriptionView.as_view(), name='create_subscription'), # noqa
    path('stripe-hook', StripeHookView.as_view(), name='stripe_hook'),
]
