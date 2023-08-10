from django.urls import path

from budget.views import (
    CreateCategoryView,
)

urlpatterns = [
    path('category', CreateCategoryView.as_view(), name='create_category'),
]
