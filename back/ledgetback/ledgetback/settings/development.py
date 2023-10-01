from .base import *
from .debugging import *
import os
import requests
import jwt
import json
import sys

# IMPORTANT FLAGS
DEVELOPMENT = True

ALLOWED_HOSTS = ['localhost']
DOMAIN_URL = "https://localhost:8000/"
DOMAIN = 'localhost'

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True

if DEBUG:
    SECURE_SSL_REDIRECT = False
else:
    SECURE_SSL_REDIRECT = True

MEDIA_ROOT = '/ledgetback/media'


# ---------------------------------------------------------------------------- #
#                                 Csrf Settings                                #
# ---------------------------------------------------------------------------- #

CSRF_COOKIE_NAME = 'csrftoken'
CSRF_COOKIE_AGE = 60 * 60 * 24 * 30  # 1 month
CSRF_SAMESITE = 'lax'
CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = ['https://localhost:3000']
CSRF_COOKIE_HTTPONLY = False
CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN'
CSRF_COOKIE_DOMAIN = 'localhost'

# ---------------------------------------------------------------------------- #
#                                    Secrets                                   #
# ---------------------------------------------------------------------------- #

def get_secret(secret):
    try:
        with open(f'/run/secrets/{secret}', 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return ' '


# Django
SECRET_KEY = get_secret('django_secret_key')

# Stripe
STRIPE_API_KEY = get_secret('stripe_api_key')
STRIPE_WEBHOOK_SECRET = get_secret('stripe_webhook_secret')

# Ory
ORY_HOOK_API_KEY = get_secret('ory_hook_api_key')
ORY_HOST = 'https://reverent-lewin-bqqp1o2zws.projects.oryapis.com'
ORY_API_KEY = get_secret('ory_api_key')
oathkeeper_endpoint = 'http://oathkeeper:4456/.well-known/jwks.json'
jwks = requests.get(oathkeeper_endpoint).json()['keys']
OATHKEEPER_PUBLIC_KEY = jwt.algorithms.RSAAlgorithm.from_jwk(
    json.dumps(jwks[0])
)

# Plaid
PLAID_SANDBOX = True
PLAID_API_KEY = get_secret('plaid_api_key')
PLAID_CLIENT_ID = get_secret('plaid_client_id')
PLAID_REDIRECT_URI_ONBOARDING = 'https://localhost:3000/welcome/connect'
PLAID_REDIRECT_URI = 'https://localhost:3000/profile/connections'
PLAID_PRODUCTS = ['transactions', 'balance']
PLAID_COUNTRY_CODES = ['US']

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

# Message Bird
BIRD_API_KEY = get_secret('bird_api_key')
BIRD_SIGNING_KEY = get_secret('bird_signing_key')
BIRD_API_KEY_ID = get_secret('bird_api_key_id')

# ---------------------------------------------------------------------------- #
#                                    Celery                                    #
# ---------------------------------------------------------------------------- #

CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND')

# ---------------------------------------------------------------------------- #
#                                    Caching                                   #
# ---------------------------------------------------------------------------- #

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

# ---------------------------------- Testing --------------------------------- #

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

if 'test' in sys.argv or 'test_coverage' in sys.argv:
    from cryptography.hazmat.backends import default_backend
    from cryptography.hazmat.primitives.asymmetric import rsa

    # Generate a private key
    OATHKEEPER_PRIVATE_KEY = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    # Extract the public key from the private key
    OATHKEEPER_PUBLIC_KEY = OATHKEEPER_PRIVATE_KEY.public_key()
