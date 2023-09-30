import os
from .base import *  # noqa

from .base import MIDDLEWARE, INSTALLED_APPS

DEBUG = True
SILK_DEBUG = os.environ.get('SILK_DEBUG', 'true').lower() == 'true'

if SILK_DEBUG:
    MIDDLEWARE += [
        'django.contrib.sessions.middleware.SessionMiddleware',
        'silk.middleware.SilkyMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
    ]

    INSTALLED_APPS += ['silk']

    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [ BASE_DIR ],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]
