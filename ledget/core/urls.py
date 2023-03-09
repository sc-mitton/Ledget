from core.views import LoginView, LandingView
from core.register_views import (
    RegisterView,
    CheckoutView,
    create_checkout_session,
    stripe_config,
    StripeWebhook,
)

from django.urls import include, path
from django.contrib.auth.views import LogoutView


urlpatterns = [
    path('', LandingView.as_view(), name='landing'),
    path('accounts/', include('allauth.urls')),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', LoginView.as_view(), name='forgot_password'),
    path('config/', stripe_config, name='config'),
    path('create-checkout-session/', create_checkout_session, name='create_checkout_session'),
    path('subscribe-hook/', StripeWebhook.as_view(), name='subscribe-hook'),
]
