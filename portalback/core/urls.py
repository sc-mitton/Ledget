from django.urls import path
from core.user_views import (
    getRoutes,
    CreateUserView,
    UpdateUserView,
    LogoutView,
)
from .user_views import CookieTokenObtainPairView, CookieTokenRefreshView
from .checkout_views import (
    PriceView,
    StripeHookView,
    SubscriptionView
)

urlpatterns = [
    path('routes/', getRoutes, name='routes'),
    path('token/', CookieTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(),
         name='token_refresh'),
    path('user/', CreateUserView.as_view(), name='create-user'),
    path('user/update/', UpdateUserView.as_view(), name='update-user'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('price/', PriceView.as_view(), name='price'),
    path('subscription/create/', SubscriptionView.as_view(),
         name='create-subscription'),
    path('stripe-hook/', StripeHookView.as_view(), name='stripe-hook'),
]
