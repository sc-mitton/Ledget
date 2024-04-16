import json

from .base import *
from .get_aws_secret import get_secret

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

# Plaid
PLAID_ENVIRONMENT = 'Production'
PLAID_API_KEY = get_secret('plaid_api_key')
PLAID_CLIENT_ID = get_secret('plaid_client_id')
PLAID_REDIRECT_URI_ONBOARDING = 'https://ledget.app/welcome/connect'
PLAID_REDIRECT_URI = 'https://leddget.app/settings/connections'

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
