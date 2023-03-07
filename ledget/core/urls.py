from django.urls import include, path

from core.views import LoginView
from core.register_views import RegisterView, CheckoutView
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('accounts/', include('allauth.urls')),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', LoginView.as_view(), name='forgot_password')
]
