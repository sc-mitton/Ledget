from django.urls import include, path

from core.views import UserGatewayView


urlpatterns = [
    path('oath/', include('social_django.urls', namespace='social')),
    path('<str:page>/', UserGatewayView.as_view(), name='user_gateway'),
]
