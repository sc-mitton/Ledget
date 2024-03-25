from django.urls import path, include
from core.views import service as service_views
from core.views.user import UserView, EmailView
from core.views.device import (
     DeviceView,
     DestroyDeviceView,
)
from core.views.health import health


urlpatterns = [
     path('user/me', UserView.as_view(), name='user_me'),
     path('user/email', EmailView.as_view(), name='user_email'),

     path('device/<str:id>', DestroyDeviceView.as_view(), name='device'),
     path('devices', DeviceView.as_view(), name='devices'),

     path('prices', service_views.PriceView.as_view(), name='prices'),
     path('default_payment_method', service_views.PaymentMethodView.as_view(),
          name='default_payment_method'),
     path('customer', service_views.CreateCustomerView.as_view(),
          name='customer'),
     path('subscription', service_views.SubscriptionView.as_view(),
          name='subscription'),
     path('subscription/<str:id>',
          service_views.UpateSubscriptionView.as_view()),
     path('subscription_item', service_views.SubscriptionItemsView.as_view(),
          name='subscription_item'),
     path('setup_intent', service_views.GetSetupIntent.as_view(),
          name='setup_intent'),

     path('next_invoice', service_views.NextInvoice.as_view(),
          name='next_invoice'),

     path('', include('budget.urls')),
     path('', include('financials.urls')),
     path('health', health, name='health'),
     path('allow-anonymous', health, name='allow_anonymous'),
     path('allow-with-auth', health, name='allow_with_auth')
]
