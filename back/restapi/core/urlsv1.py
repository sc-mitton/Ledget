from django.urls import path

from core.views.user import UserView, EmailView, UserSessionExtendView, FeedbackView
from core.views.device import (
    DeviceView,
    DestroyDeviceView,
)
from core.views.health import HealthView
from core.views import service as service_views


urlpatterns = [
    path('user/me', UserView.as_view(), name='user_me'),
    path('user/email', EmailView.as_view(), name='user_email'),
    path('user/session/extend', UserSessionExtendView.as_view(),
         name='user_session_extend'),
    path("feedback", FeedbackView.as_view(), name="feedback"),

    path('device/<str:id>', DestroyDeviceView.as_view(), name='device'),
    path('devices', DeviceView.as_view(), name='devices'),

    path('health', HealthView.as_view(), name='health'),

    path('prices', service_views.PriceView.as_view(), name='prices'),
    path('default_payment_method', service_views.PaymentMethodView.as_view(),
         name='default_payment_method'),
    path('customer', service_views.CreateCustomerView.as_view(),
         name='customer'),
    path('subscription', service_views.SubscriptionView.as_view(),
         name='subscription'),
    path('subscription/<str:id>',
         service_views.DeleteRestartSubscriptionView.as_view(),
         name='delete-restart-subscription'
         ),
    path('subscription_item', service_views.SubscriptionItemView.as_view(),
         name='subscription-item'),
    path('setup_intent', service_views.GetSetupIntent.as_view(),
         name='setup-intent'),
    path('next_invoice', service_views.NextInvoice.as_view(),
         name='next-invoice'),
]
