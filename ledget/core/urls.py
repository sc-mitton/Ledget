from django.urls import include, path

from core.views import UserGatewayView, SubscriptionView
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('accounts/', include('allauth.urls')),
    path('login/', UserGatewayView.as_view(), name='login'),
    path('register/', UserGatewayView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/',
         UserGatewayView.as_view(), name='forgot_password'),
    path('subscription/', SubscriptionView.as_view(), name='subscription'),
]
