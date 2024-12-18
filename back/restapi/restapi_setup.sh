#!/bin/bash

mkdir -p /var/app/staging/logs &&
sudo chmod 666 /var/app/staging/logs/ledget_logs && touch /var/app/staging/logs/ledget_logs &&
sudo chmod 666 /var/app/staging/logs/gunicorn_logs && touch /var/app/staging/logs/gunicorn_logs &&
sudo chmod 666 /var/app/staging/logs/stripe_logs && touch /var/app/staging/logs/stripe_logs &&
export DJANGO_SETTINGS_MODULE=restapi.settings.production &&
export CELERY_BROKER_URL="" &&
export CELERY_RESULT_BACKEND=""
