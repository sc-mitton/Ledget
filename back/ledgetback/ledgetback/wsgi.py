"""
WSGI config for authapi project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

from django.core.wsgi import get_wsgi_application
from .set_django_settings import set_django_settings

set_django_settings()
application = get_wsgi_application()
