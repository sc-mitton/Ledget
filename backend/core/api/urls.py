from django.urls import path
from .views import (
    getRoutes,
    CustomTokenObtainPairSerializer,
    CustomTokenObtainPairView,
    CreateUserView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', getRoutes, name='routes'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('v1/user/', CreateUserView.as_view(), name='user'),
]
