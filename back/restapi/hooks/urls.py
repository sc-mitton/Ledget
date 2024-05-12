from django.urls import path

from .views import (
    StripeHookView,
    OryRegistrationHook,
    OrySettingsPasswordHook,
    OryVerificationHook,
    PlaidItemHookView
)
from restapi.decorators import csrf_ignore


urlpatterns = [
    path('stripe', csrf_ignore(StripeHookView.as_view()),
         name='stripe_hook'),
    path('ory/registration', csrf_ignore(OryRegistrationHook.as_view()),
         name='ory-registration-hook'),
    path('ory/settings/password', csrf_ignore(OrySettingsPasswordHook.as_view()),
         name='ory-settings-password-hook'),
    path('ory/verification', csrf_ignore(OryVerificationHook.as_view()),
         name='ory-verification-hook'),
    path('plaid/item', csrf_ignore(PlaidItemHookView.as_view()),
         name='plaid-webhook')
]
