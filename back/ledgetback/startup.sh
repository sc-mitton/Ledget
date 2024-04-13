#!/bin/bash

export DJANGO_SETTINGS_MODULE="ledgetback.settings.prod"
export CELERY_BROKER_URL=" "
export CELERY_RESULT_BACKEND=" "

gunicorn -c gunicorn.conf.py ledgetback.wsgi
