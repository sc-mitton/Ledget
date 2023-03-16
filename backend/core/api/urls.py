from django.urls import path
from .views import (
    getRoutes,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CreateUserView
)

urlpatterns = [
    path('', getRoutes, name='routes'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('v1/user/', CreateUserView.as_view(), name='user'),
]
