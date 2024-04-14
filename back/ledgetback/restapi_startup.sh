#!/bin/bash

source set_env.sh

# Run the server
if [ $ENVIRONMENT == "dev" ]; then
    python manage.py runserver
else
    gunicorn -c gunicorn.conf.py ledgetback.wsgi
fi
