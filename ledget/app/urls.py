from django.urls import include, path

from app.views import AppView

urlpatterns = [
    path('home', AppView.as_view(), name='home'),
]
