from celery import Celery

from django.apps import apps

app = Celery("ledgetback")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks(lambda: [n.name for n in apps.get_app_configs()])
