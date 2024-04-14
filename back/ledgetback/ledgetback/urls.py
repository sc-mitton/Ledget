from django.urls import path, include
from django.conf import settings
from core.views.health import health, ProtectedHealth

API_VERSION = settings.API_VERSION
SUPPORTED_API_VERSION_CUTOFF = settings.SUPPORTED_API_VERSION_CUTOFF

urlpatterns = [
    path('hooks/', include('hooks.urls')),
    path('', health, name='health'),
    path('auth-health', ProtectedHealth.as_view(), name='auth-health')
]

for i in range(SUPPORTED_API_VERSION_CUTOFF, API_VERSION + 1):
    urlpatterns.append(path(f'v{i}/', include(f'core.urlsv{i}')))


if settings.SILK_DEBUG:
    urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]
