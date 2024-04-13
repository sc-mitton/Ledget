#!/bin/bash

export DJANGO_SETTINGS_MODULE="ledgetback.settings.prod"
export CELERY_BROKER_URL=" "
export CELERY_RESULT_BACKEND=" "

python manage.py wait_for_db &&
python manage.py migrate &&
python manage.py migrate &&
gunicorn -c gunicorn.conf.py ledgetback.wsgi
