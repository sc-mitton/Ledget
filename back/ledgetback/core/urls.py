from django.urls import path, include
from core.views import service as service_views
from core.views import user as user_views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'devices', user_views.DeviceViewSet, basename='devices')

urlpatterns = [
     path('user/me', user_views.UserView.as_view(), name='user_me'),
     path('', include(router.urls)),

     path('prices', service_views.PriceView.as_view(), name='prices'),
     path('default_payment_method', service_views.PaymentMethodView.as_view(),
          name='default_payment_method'),
     path('customer', service_views.CreateCustomerView.as_view(),
          name='customer'),
     path('subscription', service_views.SubscriptionView.as_view(),
          name='subscription'),
     path('subscription/<str:sub_id>',
          service_views.UpateSubscriptionView.as_view()),
     path('subscription_item', service_views.SubscriptionItemsView.as_view(),
          name='subscription_item'),
     path('setup_intent', service_views.GetSetupIntent.as_view(),
          name='setup_intent'),

     path('next_invoice', service_views.NextInvoice.as_view(),
          name='next_invoice'),

     path('', include('budget.urls')),
     path('', include('financials.urls')),
]
