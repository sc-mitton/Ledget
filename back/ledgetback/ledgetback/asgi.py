"""
ASGI config for api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

from django.core.asgi import get_asgi_application
from .set_django_settings import set_django_settings

set_django_settings()
application = get_asgi_application()
