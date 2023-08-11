from django.urls import path

from budget.views import (
    CreateCategoryView,
    CreateBillView
)

urlpatterns = [
    path('category', CreateCategoryView.as_view(), name='create_category'),
    path('bill', CreateBillView.as_view(), name='create_bill'),
]
