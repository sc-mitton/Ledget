from django.urls import path
from core.user_views import (
    getRoutes,
    CreateUserView,
)
from .user_views import CookieTokenObtainPairView, CookieTokenRefreshView
from core.checkout_views import CustomerView

urlpatterns = [
    path('routes/', getRoutes, name='routes'),
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'), # noqa
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'), # noqa
    path('user/', CreateUserView.as_view(), name='user'),
    path('customer/', CustomerView.as_view(), name='payment_intent'),
]
