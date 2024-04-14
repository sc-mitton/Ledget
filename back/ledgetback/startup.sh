#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide the environment to run the server"
    exit 1
fi

if [ "$1" == "dev" ]; then
    export DJANGO_SETTINGS_MODULE="ledgetback.settings.dev"
    export CELERY_BROKER_URL="redis://localhost:6379/0"
    export CELERY_RESULT_BACKEND="redis://localhost:6379/0"
elif [ "$1" == "prod" ]; then
    export DJANGO_SETTINGS_MODULE="ledgetback.settings.prod"
    export CELERY_BROKER_URL=" "
    export CELERY_RESULT_BACKEND=" "
elif [ "$1" == "uat" ]; then
    export DJANGO_SETTINGS_MODULE="ledgetback.settings.uat"
    export CELERY_BROKER_URL=" "
    export CELERY_RESULT_BACKEND=" "
else
    echo "Invalid environment"
    exit 1
fi

# Wait for the database to be ready and then run the migrations
python manage.py wait_for_db &&
python manage.py makemigrations &&
python manage.py migrate

# Run the server
if [ "$1" == "dev" ]; then
    python manage.py runserver
else
    gunicorn -c gunicorn.conf.py ledgetback.wsgi
fi
