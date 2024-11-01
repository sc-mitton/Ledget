#!/bin/bash

source set_env.sh

celery -A restapi beat -l info & celery -A restapi worker -l info
