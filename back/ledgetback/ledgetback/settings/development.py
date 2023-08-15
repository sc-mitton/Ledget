from .base import *
from .debugging import *
import os
import requests
import jwt
import json

from corsheaders.defaults import default_headers

# IMPORTANT FLAGS
DEVELOPMENT = True
PLAID_SANDBOX = True

ALLOWED_HOSTS = ['localhost']
DOMAIN_URL = "https://localhost:8000/"
DOMAIN = 'localhost'

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True
SECURE_BROWSER_XSS_FILTER = True

if DEBUG:
    SECURE_SSL_REDIRECT = False
else:
    SECURE_SSL_REDIRECT = True


CORS_ORIGIN_WHITELIST = [
    'https://localhost:3001',
    'https://localhost:3000',
    'http://localhost',
]
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
CORS_ALLOW_HEADERS = list(default_headers) + [
    'Set-Cookie',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials'
]
CORS_ALLOW_CREDENTIALS = True

MEDIA_ROOT = '/ledgetback/media'


# ---------------------------------------------------------------- #
#                        Secrets                                   #
# ---------------------------------------------------------------- #

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
ORY_API_KEY = get_secret('ory_api_key')
oathkeeper_endpoint = 'http://oathkeeper:4456/.well-known/jwks.json'
jwks = requests.get(oathkeeper_endpoint).json()['keys']
OATHKEEPER_PUBLIC_KEY = jwt.algorithms.RSAAlgorithm.from_jwk(
    json.dumps(jwks[0])
)

# Plaid
PLAID_CLIENT_ID = get_secret('plaid_client_id')
PLAID_API_KEY = get_secret('plaid_api_key')
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
