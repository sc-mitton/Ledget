#!/bin/bash

source set_env.sh

python manage.py wait_for_db &&
python manage.py migrate

# Run the server
if [ $ENVIRONMENT == "dev" ]; then
    python manage.py runserver
else
    gunicorn -c gunicorn.conf.py ledgetback.wsgi
fi
