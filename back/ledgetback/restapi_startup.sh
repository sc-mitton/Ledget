#!/bin/bash

source set_env.sh

# Run the server
if [ $ENVIRONMENT == "dev" ]; then
    python manage.py runserver &
else
    gunicorn -c gunicorn.conf.py ledgetback.wsgi &
fi

# Wait 20s for the server to start
sleep 20
python manage.py wait_for_db &&
python manage.py makemigrations &&
python manage.py migrate
