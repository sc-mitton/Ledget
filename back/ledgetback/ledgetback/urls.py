from django.urls import path, include
from django.conf import settings

urlpatterns = [
    path('api/v1/', include('core.urls')),
    path('hooks/', include('hooks.urls'))
]

if settings.DEBUG:
    import socket  # only if you haven't already imported this
    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS = [ip[: ip.rfind(".")] + ".1" for ip in ips] + ["127.0.0.1", "10.0.2.2"] # noqa
