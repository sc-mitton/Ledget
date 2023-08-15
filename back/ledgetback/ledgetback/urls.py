from django.urls import path, include
from django.conf import settings

urlpatterns = [
    path('api/v1/', include('core.urls')),
    path('hooks/', include('hooks.urls'))
]


if settings.DEBUG:
    urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]
