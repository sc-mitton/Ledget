#!/bin/bash

source set_env.sh

env=$ENVIRONMENT
api_version=$API_VERSION

echo "Environment: $env"
echo "API Version: $api_version"

python manage.py wait_for_db &&
python manage.py makemigrations &&
python manage.py migrate

# Run the server
if [ "$env" == "dev" ]; then
    python manage.py runserver
else
    gunicorn -c gunicorn.conf.py ledgetback.wsgi
fi
