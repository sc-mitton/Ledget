from django.urls import path

from core.views.user import (
     UserView,
     CoOwnerView,
     EmailView,
     UserSessionExtendView,
     DisabledSessionView,
     UserTokenSessionExtendView,
     FeedbackView,
     AddUserToAccountView,
     UserSettingsView,
)
from core.views.device import (
    DeviceView,
    DestroyDeviceView,
)
from core.views.health import HealthView
from core.views import service as service_views


urlpatterns = [
    path('user/me', UserView.as_view(), name='user-me'),
    path('user/settings', UserSettingsView.as_view(), name='user-settings'),
    path('user/co-owner', CoOwnerView.as_view(), name='user-co-owner'),
    path('user/email', EmailView.as_view(), name='user_email'),
    path('user/account', AddUserToAccountView.as_view(), name='add-user-to-account'),
    path('user/session/extend', UserSessionExtendView.as_view(),
         name='session-extend'),
    path('user/session', DisabledSessionView.as_view(), name='disable-session'),
    path('user/token-session/<str:id>/extend', UserTokenSessionExtendView.as_view(),
         name='token-session-extend'),
    path("feedback", FeedbackView.as_view(), name="feedback"),

    path('device/<str:id>', DestroyDeviceView.as_view(), name='device'),
    path('devices', DeviceView.as_view(), name='devices'),

    path('health', HealthView.as_view(), name='health'),

    path('prices', service_views.PriceView.as_view(), name='prices'),
    path('default-payment-method', service_views.PaymentMethodView.as_view(),
         name='default-payment-method'),
    path('customer', service_views.CreateCustomerView.as_view(),
         name='customer'),
    path('subscription', service_views.SubscriptionView.as_view(),
         name='subscription'),
    path('subscription/<str:id>',
         service_views.DeleteRestartSubscriptionView.as_view(),
         name='delete-restart-subscription'
         ),
    path('subscription-item', service_views.SubscriptionItemView.as_view(),
         name='subscription-item'),
    path('setup-intent', service_views.GetSetupIntent.as_view(),
         name='setup-intent'),
    path('next-invoice', service_views.NextInvoice.as_view(),
         name='next-invoice'),
]
