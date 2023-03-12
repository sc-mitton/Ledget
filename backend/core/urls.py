from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path('api/', include('core.api.urls')),
    path('', TemplateView.as_view(template_name='site.html'), name='home'),
]
