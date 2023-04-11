from django.urls import path
from core.user_views import (
    getRoutes,
    CreateUserView,
    UpdateUserView,
    LogoutView
)
from .user_views import CookieTokenObtainPairView, CookieTokenRefreshView
from .checkout_views import (
    PriceView,
    StripeHookView,
    SubscriptionView,
    CreateCustomerView
)

urlpatterns = [
    path('routes', getRoutes, name='routes'),
    path('token', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'), # noqa
    path('token/refresh', CookieTokenRefreshView.as_view(), name='token_refresh'), # noqa

    path('user', CreateUserView.as_view(), name='create_user'),
    path('user/<uuid:pk>', UpdateUserView.as_view(), name='update_user'),
    path('customer', CreateCustomerView.as_view(), name='create_customer'),
    path('logout', LogoutView.as_view(), name='logout'),

    path('prices', PriceView.as_view(), name='prices'),
    path('subscription', SubscriptionView.as_view(), name='create_subscription'), # noqa
    path('stripe-hook', StripeHookView.as_view(), name='stripe_hook'),
]
