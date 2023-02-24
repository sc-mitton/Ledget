from django.contrib import admin
from django.urls import include, path

from core.views import LoginView


urlpatterns = [
    path('oath/', include('social_django.urls', namespace='social')),
    path('login', LoginView.as_view(), name='login'),
]
