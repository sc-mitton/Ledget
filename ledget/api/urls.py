from django.urls import path
from .views import (
    CustomTokenObtainPairView,
    getRoutes
)
from .user_views import CreateUserView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),
    path('register', CreateUserView.as_view(), name='register'),
    path('', getRoutes, name='routes')
]
