#!/bin/bash

env=$ENVIRONMENT
api_version=$API_VERSION

echo "Environment: $env"
echo "API Version: $api_version"

if [ -n "$api_version" ]; then
    export API_VERSION=$api_version
else
    # delete the environment variable
    unset API_VERSION
fi

if [ "$env" == "dev" ]; then
    export DJANGO_SETTINGS_MODULE=ledgetback.settings.dev
elif [ "$env" == "celery" ]; then
    export DJANGO_SETTINGS_MODULE=ledgetback.settings.celery
    export CELERY_BROKER_URL=" "
    export CELERY_RESULT_BACKEND=" "
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

echo "Environment set to $env"
