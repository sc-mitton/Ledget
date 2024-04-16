from django.urls import path, include
from rest_framework.routers import SimpleRouter

from budget.views import (
    CategoryViewSet,
    BillViewSet,
    ReminderView
)

categories_router = SimpleRouter(trailing_slash=False)
categories_router.register('categories', CategoryViewSet, basename='categories')

bills_router = SimpleRouter(trailing_slash=False)
bills_router.register('bills', BillViewSet, basename='bills')

urlpatterns = [
    path('', include(categories_router.urls)),
    path('', include(bills_router.urls)),
    path('reminders', ReminderView.as_view(), name='reminders')
]
