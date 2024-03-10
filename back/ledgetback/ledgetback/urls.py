from django.urls import path, include
from django.conf import settings

URL_PREFIX = 'api/' if settings.DEVELOPMENT else ''
API_VERSION = settings.API_VERSION

urlpatterns = [
    path('hooks/', include('hooks.urls'))
]

for i in range(1, API_VERSION + 1):
    urlpatterns.append(path(URL_PREFIX + f'{i}/', include(f'core.urls{i}')))


if settings.SILK_DEBUG:
    urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]
