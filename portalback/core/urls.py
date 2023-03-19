from django.urls import path
from user_views import (
    getRoutes,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CreateUserView,
)
from checkout_views import CustomerView

urlpatterns = [
    path('', getRoutes, name='routes'),
    path('token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(),
         name='token_refresh'),
    path('v1/user/', CreateUserView.as_view(), name='user'),
    path('customer/', CustomerView.as_view(), name='payment_intent')
]
