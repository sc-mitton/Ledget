from django.urls import path
from health.views import health, ProtectedHealth

urlpatterns = [
    path('health', health, name='health'),
    path('auth-health', ProtectedHealth.as_view(), name='auth-health')
]
