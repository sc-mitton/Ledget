from django.urls import path

from .views import (
    StripeHookView,
    OryRegistrationHook,
    OrySettingsPasswordHook
)

urlpatterns = [
    path('stripe', StripeHookView.as_view(), name='stripe_hook'),
    path('ory/registration', OryRegistrationHook.as_view(), name='ory_register_hook'),
    path('ory/settings/password', OrySettingsPasswordHook.as_view(),
         name='ory_settings_password_hook'),
]
