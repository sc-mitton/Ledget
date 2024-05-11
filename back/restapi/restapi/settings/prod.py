from .base import *
import os
import jwt
import json
from .get_aws_secret import get_secret


ALLOWED_HOSTS = [
    'ledget.app',
    '*.ledget.app',
    'ledget-restapi-prod-qlkrq0u.us-west-2.elasticbeanstalk.com',
]
DOMAIN_URL = "https://api.ledget.app/"
DOMAIN = 'api.ledget.app'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True

# ----------------------------------- Csrf ----------------------------------- #

CSRF_TRUSTED_ORIGINS = ['https://ledget.app', 'https://accounts.ledget.app']
CSRF_COOKIE_DOMAIN = '.ledget.app'

# ---------------------------------- 3rd Party Services --------------------------------- #

# Django
SECRET_KEY = get_secret('django_secret_key')

# Stripe
STRIPE_API_KEY = get_secret('stripe_api_key')
STRIPE_WEBHOOK_SECRET = get_secret('stripe_webhook_secret')

# Ory
ORY_HOST = 'https://auth.ledget.app'
ORY_HOOK_API_KEY = get_secret('ory_hook_api_key')
ORY_API_KEY = get_secret('ory_api_key')

# Oathkeeper
jwks = get_secret('oathkeeper_jwks')
try:
    jwks = json.loads(jwks)['keys'][0]
    for k in [ 'd', 'p', 'q', 'dp', 'dq', 'qi' ]:
        del jwks[k]
    OATHKEEPER_PUBLIC_KEY = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwks))
except Exception as e:
    OATHKEEPER_PUBLIC_KEY = None

# Sparkpost
SPARKPOST_API_KEY = get_secret('sparkpost_key')

# Plaid
PLAID_ENVIRONMENT = 'Production'
PLAID_API_KEY = get_secret('plaid_api_key')
PLAID_CLIENT_ID = get_secret('plaid_client_id')
PLAID_REDIRECT_URI_ONBOARDING = 'https://ledget.app/welcome/connect'
PLAID_REDIRECT_URI = 'https://leddget.app/settings/connections'
PLAID_WEBHOOK_ENDPOINT = 'https://api.ledget.app/hooks/plaid/item'

# --------------------------------- Postgres --------------------------------- #

db_credentials = get_secret('ledget-restapi-rds-credentials')
db_credentials = json.loads(db_credentials) if db_credentials else {}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': db_credentials.get('dbname'),
        'HOST': db_credentials.get('host'),
        'PORT': db_credentials.get('port'),
        'USER': db_credentials.get('username'),
        'PASSWORD': db_credentials.get('password'),
    }
}

# ---------------------------------- Celery ---------------------------------- #

CELERY_BROKER_URL = os.getenv('celery_broker_url')
CELERY_RESULT_BACKEND = os.getenv('celery_result_backend')

# ---------------------------------- Caching --------------------------------- #

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}
