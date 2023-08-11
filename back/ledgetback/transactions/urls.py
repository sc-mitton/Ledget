from django.urls import path

from transactions.views import TransactionsSyncView

urlpatterns = [
    path('sync', TransactionsSyncView.as_view(), name='sync'),
]
