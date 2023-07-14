from pathlib import Path
import os
import sys
import requests
import jwt
import json


def get_secret(secret):
    try:
        with open(f'/run/secrets/{secret}', 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return ' '


SECRET_KEY = get_secret('django_secret_key')
BASE_DIR = Path(__file__).resolve().parent.parent.parent

APPEND_SLASH = False
SITE_ID = 1


# Stripe
STRIPE_API_KEY = get_secret('stripe_api_key')
STRIPE_WEBHOOK_SECRET = get_secret('stripe_webhook_secret')

# Ory
ORY_API_KEY = get_secret('ory_api_key')
oathkeeper_endpoint = 'http://oathkeeper:4456/.well-known/jwks.json'
jwks = requests.get(oathkeeper_endpoint).json()['keys']
OATHKEEPER_PUBLIC_KEY = jwt.algorithms.RSAAlgorithm.from_jwk(
    json.dumps(jwks[0])
)

# Postgres
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
        'USER': get_secret('postgres_user'),
        'PASSWORD': get_secret('postgres_password'),
    }
}

# -------------------------------------------------------------- #
#                  Application Defenition                        #
# -------------------------------------------------------------- #

DEFAULT_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.sites',
]
THIRD_PARTY_APPS = [
    'sslserver',
    'rest_framework',
    'corsheaders'
]
LOCAL_APPS = [
    'core.apps.CoreConfig',
    'hooks.apps.HooksConfig'
]
INSTALLED_APPS = DEFAULT_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Middleware
DEFAULT_MIDDLE_WARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
THIRD_PARTY_MIDDLE_WARE = [
    'corsheaders.middleware.CorsMiddleware',
]
LOCAL_MIDDLE_WARE = []

MIDDLEWARE = DEFAULT_MIDDLE_WARE + THIRD_PARTY_MIDDLE_WARE + LOCAL_MIDDLE_WARE

ROOT_URLCONF = 'ledgetback.urls'

WSGI_APPLICATION = 'ledgetback.wsgi.application'


# ---------------------------------------------------------------- #
#                 Authentication Settings                          #
# ---------------------------------------------------------------- #

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'ledgetback.auth.ory.OryBackend',
    ),
}

AUTH_USER_MODEL = 'core.User'
AUTHENTICATION_BACKENDS = ('django.contrib.auth.backends.ModelBackend')

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ---------------------------------------------------------------- #
#                        Logging Settings                          #
# ---------------------------------------------------------------- #
LOG_LEVEL = 'DEBUG'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': LOG_LEVEL,
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/ledget.log'),
            'formatter': 'verbose',
        },
        'stripe': {
            'level': LOG_LEVEL,
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/stripe.log'),
            'formatter': 'verbose',
        },
        'console': {
            'level': LOG_LEVEL,
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO'
        },
        'ledget': {
            'handlers': ['file', 'console'],
            'level': LOG_LEVEL
        },
        'stripe': {
            'handlers': ['stripe', 'console'],
            'levels': LOG_LEVEL
        },
    }
}

# When running tests, we don't want tons of logs being printed out
TEST = {
    'LOGGING_OVERRIDE': {
        'console': {
            'level': 'CRITICAL',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    }
}

if 'test' in sys.argv or 'test_coverage' in sys.argv:
    # Covers regular testing and coverage testing
    LOGGING['handlers'].update(TEST['LOGGING_OVERRIDE'])
