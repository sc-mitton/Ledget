#!/bin/bash

source set_env.sh

celery -A ledgetback worker -l info
