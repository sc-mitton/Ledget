from django.urls import path
from .views.user_view import UserView
from .views.service_views import (
    PriceView,
    SubscriptionView,
    CustomerView
)
from .views.link_view import LinkView

urlpatterns = [
    path('prices', PriceView.as_view(), name='prices'),
    path('user/me', UserView.as_view(), name='user'),
    path('user/<str:user_id>/customer',
         CustomerView.as_view(), name='customer'),
    path('user/<str:user_id>/subscription',
         SubscriptionView.as_view(), name='subscription'),
    path('link', LinkView.as_view(), name='link'),
]
