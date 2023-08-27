from django.urls import path

from budget.views import (
    CreateBudgetCategoryView,
    CreateBillView
)

urlpatterns = [
    path('category',
         CreateBudgetCategoryView.as_view(),
         name='create_category'),
    path('bill', CreateBillView.as_view(), name='create_bill')
]
