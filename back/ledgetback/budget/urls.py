from django.urls import path

from budget.views import (
    CategoryView,
    BillView,
    RecomendedBillsView
)

urlpatterns = [
    path('category',
         CategoryView.as_view(),
         name='create_category'),
    path('bill', BillView.as_view(), name='create_bill'),
    path('categories', CategoryView.as_view(), name='get_categories'),
    path('bills', BillView.as_view(), name='get_bills'),
    path('bills/recommendations', RecomendedBillsView.as_view(),
         name='get_recomended_bills'),
]
