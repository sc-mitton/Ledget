from django.urls import path

from institutions.views import TransactionsSyncView

urlpatterns = [
    path('transactions/sync', TransactionsSyncView.as_view(), name='sync'),
]
