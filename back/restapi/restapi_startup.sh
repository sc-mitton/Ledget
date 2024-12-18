#!/bin/bash

source set_env.sh

# Run the server
if [ $ENVIRONMENT == "dev" ]; then
    python manage.py wait_for_db &&
    python manage.py makemigrations &&
    python manage.py migrate &&
    python manage.py runserver 0.0.0.0:8000
else
    mkdir -p /var/app/staging/logs &&
    touch /var/app/staging/logs/ledget_logs && chmod 666 /var/app/staging/logs/ledget_logs &&
    touch /var/app/staging/logs/gunicorn_logs && chmod 666 /var/app/staging/logs/gunicorn_logs &&
    touch /var/app/staging/logs/stripe_logs && chmod 666 /var/app/staging/logs/stripe_logs
fi
