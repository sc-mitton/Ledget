from django.urls import path, include

urlpatterns = [
     path('', include('core.urlsv1')),
     path('', include('budget.urlsv1')),
     path('', include('financials.urlsv1'))
]
