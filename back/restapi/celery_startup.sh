#!/bin/bash

celery -A restapi beat -l info & celery -A restapi worker -l info
