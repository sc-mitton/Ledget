from .base import *
from .debugging import *
import os
import requests
import jwt
import json
import sys
from pathlib import Path

from corsheaders.defaults import default_headers

# IMPORTANT FLAGS
DEVELOPMENT = True

DOMAIN_URL = "https://localhost:8000/"
DOMAIN = 'localhost'
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '10.0.2.2']
ACCOUNTS_APP_DOMAIN = 'localhost:3001'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True

MEDIA_ROOT = '/restapi/media'

# ----------------------------------- Csrf ----------------------------------- #

CSRF_TRUSTED_ORIGINS = ['https://localhost:3000', 'https://localhost:3001']
CSRF_COOKIE_DOMAIN = 'localhost'

# ----------------------------------- CORS ----------------------------------- #

CORS_ALLOWED_ORIGINS = [
    'https://localhost:3000',
    'https://localhost:3001',
]

CORS_ALLOWED_HEADERS = [
    *default_headers,
    'x-forwarded-host',
    'x-user',
    'x-device-token',
]

CORS_ALLOW_CREDENTIALS = True

INSTALLED_APPS += [
    'corsheaders',
]

MIDDLEWARE.insert(1, 'corsheaders.middleware.CorsMiddleware')

# ---------------------------------- 3rd Party Services --------------------------------- #


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
STRIPE_PRICE_ID = 'prod_NStMoPQOCocj2H'

# Ory
ORY_HOST = 'https://reverent-lewin-bqqp1o2zws.projects.oryapis.com'
ORY_HOOK_API_KEY = get_secret('ory_hook_api_key')
ORY_API_KEY = get_secret('ory_api_key')
ORY_USER_SCHEMA_ID = (
    '0a6ec3dda66dbf64a8274fd8da74139243ad7e3'
    '004949f535b72d62754858d98ddbe057d886ab602'
    'e0d2555e2e8ac78d8f3cb7a9c6294e40fb5983762a855651'
)
ORY_ACTIVATION_REDIRECT_URL = f'https://{ACCOUNTS_APP_DOMAIN}/activation'

# Oathkeeper
OATHKEEPER_ENDPOINT = 'http://oathkeeper:4456/.well-known/jwks.json'
if any(a in sys.argv for a in ['test', 'test_coverage', 'migrate', 'makemigrations']):
    OATHKEEPER_PUBLIC_KEY = None
else:
    jwks = requests.get(OATHKEEPER_ENDPOINT).json()['keys']
    OATHKEEPER_PUBLIC_KEY = jwt.algorithms.RSAAlgorithm.from_jwk(
        json.dumps(jwks[0]))

# Sparkpost
SPARKPOST_API_KEY = get_secret('sparkpost_api_key')

# Plaid
PLAID_ENVIRONMENT = os.getenv('PLAID_ENVIRONMENT') or 'Sandbox'
PLAID_API_KEY = get_secret('plaid_sand_api_key') if PLAID_ENVIRONMENT.lower(
) == 'sandbox' else get_secret('plaid_api_key')
PLAID_CLIENT_ID = get_secret('plaid_client_id')
PLAID_REDIRECT_URI_ONBOARDING = 'https://localhost:3000/welcome/connect'
PLAID_REDIRECT_URI = 'https://localhost:3000/settings/connections'

# This webhook endpoint wont work since we have to use ngrok, but it has to be something for the code to work
PLAID_WEBHOOK_ENDPOINT = os.getenv(
    'PLAID_WEBHOOK_ENDPOINT') or 'https://localhost:8000/hooks/plaid/item'

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
