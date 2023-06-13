from django.urls import path

from .views import StripeHookView, OryHookView

urlpatterns = [
    path('stripe', StripeHookView.as_view(), name='stripe_hook'),
    path('ory', OryHookView.as_view(), name='ory_hook'),
]
