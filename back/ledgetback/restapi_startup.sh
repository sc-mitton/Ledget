#!/bin/bash

source set_env.sh

# Run the server
if [ $ENVIRONMENT == "dev" ]; then
    python manage.py wait_for_db &&
    python manage.py makemigrations &&
    python manage.py migrate &&
    python manage.py runserver
else
    python manage.py migrate &&
    gunicorn -c gunicorn.conf.py ledgetback.wsgi
fi
