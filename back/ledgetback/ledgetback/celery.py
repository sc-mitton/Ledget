from celery import Celery
import os

from django.apps import apps

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ledgetback.settings.development")
app = Celery("ledgetback")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks(lambda: [n.name for n in apps.get_app_configs()])
