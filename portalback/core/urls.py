from django.urls import path
from core.user_views import (
    getRoutes,
    CreateUserView,
    LogoutView,
)
from .user_views import CookieTokenObtainPairView, CookieTokenRefreshView
from .checkout_views import PriceView

urlpatterns = [
    path('routes/', getRoutes, name='routes'),
    path('token/', CookieTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(),
         name='token_refresh'),
    path('user/', CreateUserView.as_view(), name='user'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('price/', PriceView.as_view(), name='price'),
]
