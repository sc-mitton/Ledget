#!/bin/bash

source set_env.sh

celery -A restapi worker -l info
