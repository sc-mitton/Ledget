from django.urls import path

from .views import (
    StripeHookView,
    OryRegistrationHook,
    OrySettingsPasswordHook,
    OryVerificationHook,
    PlaidItemHookView
)
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('stripe', csrf_exempt(StripeHookView.as_view()),
         name='stripe_hook'),
    path('ory/registration', csrf_exempt(OryRegistrationHook.as_view()),
         name='ory_register_hook'),
    path('ory/settings/password', csrf_exempt(OrySettingsPasswordHook.as_view()),
         name='ory_settings_password_hook'),
    path('ory/verification', csrf_exempt(OryVerificationHook.as_view()),
         name='ory_verification_hook'),
    path('plaid/item', csrf_exempt(PlaidItemHookView.as_view()),
         name='plaid_item_hook')
]
