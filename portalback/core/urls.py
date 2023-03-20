from django.urls import path
from core.user_views import (
    getRoutes,
    LoginTokenObtainPairView,
    CustomTokenRefreshView,
    CreateUserView,
)
from core.checkout_views import CustomerView

urlpatterns = [
    path('routes/', getRoutes, name='routes'),
    path('token/', LoginTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(),
         name='token_refresh'),
    path('user/', CreateUserView.as_view(), name='user'),
    path('customer/', CustomerView.as_view(), name='payment_intent'),
]
