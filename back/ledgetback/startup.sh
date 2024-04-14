#!/bin/bash

usage() {
    echo "Usage: $0 -e <environment> -v <api_version>"
    exit 1
}

# Parsing options
env=$ENVIRONMENT
api_version=$API_VERSION

echo "Environment: $env"
echo "API Version: $api_version"

export API_VERSION=$api_version

if [ "$env" == "dev" ]; then
    export DJANGO_SETTINGS_MODULE=ledgetback.settings.dev
elif [ "$env" == "uat" ]; then
    export DJANGO_SETTINGS_MODULE=ledgetback.settings.uat
    export CELERY_BROKER_URL=" "
    export CELERY_RESULT_BACKEND=" "
elif [ "$env" == "prod" ]; then
    export DJANGO_SETTINGS_MODULE=ledgetback.settings.prod
    export CELERY_BROKER_URL=" "
    export CELERY_RESULT_BACKEND=" "
else
    echo "Environment not set"
    exit 1
fi

# Wait for the database to be ready and then run the migrations
python manage.py wait_for_db &&
python manage.py makemigrations &&
python manage.py migrate

# Run the server
if [ "$env" == "dev" ]; then
    python manage.py runserver
else
    gunicorn -c gunicorn.conf.py ledgetback.wsgi
fi
