#!/bin/bash

export DJANGO_SETTINGS_MODULE="ledgetback.settings.prod"

python manage.py wait_for_db &&
python manage.py migrate &&
python manage.py migrate &&
gunicorn -c gunicorn.conf.py ledgetback.wsgi
