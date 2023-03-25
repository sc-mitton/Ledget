from django.urls import path
from core.user_views import (
    getRoutes,
    CreateUserView,
    LogoutView,
)
from core.checkout_views import (
    SubscriptionView
)
from .user_views import CookieTokenObtainPairView, CookieTokenRefreshView

urlpatterns = [
    path('routes/', getRoutes, name='routes'),
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'), # noqa
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'), # noqa
    path('user/', CreateUserView.as_view(), name='user'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('subscription/', SubscriptionView.as_view(),
         name='subscription'),
]
