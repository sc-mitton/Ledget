from .base import *
from pathlib import Path
from .debugging import *
import os
import requests
import jwt
import json
import sys
import botocore
import botocore.session
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig


ALLOWED_HOSTS = ['ledget.app']
DOMAIN_URL = "https://ledget.app:8000/"
DOMAIN = 'ledget.app'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True


# ----------------------------------- Csrf ----------------------------------- #

CSRF_TRUSTED_ORIGINS = ['https://ledget.app', 'https://accounts.ledget.app']
CSRF_COOKIE_DOMAIN = 'ledget.app'

# ---------------------------------- 3rd Party Services --------------------------------- #

client = botocore.session.get_session().create_client('secretsmanager')
cache_config = SecretCacheConfig()
cache = SecretCache(config=cache_config, client=client)

def get_secret(secret):
    try:
        return cache.get_secret_string(secret)
    except botocore.exceptions.NoCredentialsError:
        return ' '

# Django
SECRET_KEY = get_secret('django_secret_key')

# Stripe
STRIPE_API_KEY = get_secret('stripe_api_key')
STRIPE_WEBHOOK_SECRET = get_secret('stripe_webhook_secret')

# Ory
ORY_HOOK_API_KEY = get_secret('ory_hook_api_key')
ORY_API_KEY = get_secret('ory_api_key')

# Oathkeeper
if any(a in sys.argv for a in ['test', 'test_coverage', 'migrate', 'makemigrations']):
    OATHKEEPER_PUBLIC_KEY=None
else:
    jwks = requests.get(OATHKEEPER_ENDPOINT).json()['keys']
    OATHKEEPER_PUBLIC_KEY = jwt.algorithms.RSAAlgorithm.from_jwk(
        json.dumps(jwks[0]))

# Sparkpost
SPARKPOST_API_KEY = get_secret('sparkpost_api_key')

# Plaid
PLAID_ENVIRONMENT = 'Production'
PLAID_API_KEY = get_secret('plaid_api_key')
PLAID_CLIENT_ID = get_secret('plaid_client_id')
PLAID_REDIRECT_URI_ONBOARDING = 'https://ledget.app/welcome/connect'
PLAID_REDIRECT_URI = 'https://leddget.app/settings/connections'

# --------------------------------- Postgres --------------------------------- #

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

# ---------------------------------- Celery ---------------------------------- #

CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND')

# ---------------------------------- Caching --------------------------------- #

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}
