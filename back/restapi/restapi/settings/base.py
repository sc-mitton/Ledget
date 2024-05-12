from pathlib import Path
import os


BASE_DIR = Path(__file__).resolve().parent.parent.parent

DEVELOPMENT = False
APPEND_SLASH = False
SITE_ID = 1

# -------------------------- Application Definition -------------------------- #

API_VERSION = int(os.getenv('API_VERSION', 1))
SUPPORTED_API_VERSION_CUTOFF = 1

DEFAULT_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.sites',
]
THIRD_PARTY_APPS = [
    'sslserver',
    'rest_framework'
]
LOCAL_APPS = [
    'core.apps.CoreConfig',
    'hooks.apps.HooksConfig',
    'budget.apps.BudgetConfig',
    'financials.apps.FinancialsConfig',
]

INSTALLED_APPS = DEFAULT_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Middleware
MIDDLEWARE = [
    'restapi.middleware.health.HealthCheckMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'restapi.middleware.authentication.OryAuthenticationMiddleware',
    'restapi.middleware.session.OrySessionMiddleware',
    'restapi.middleware.csrf.CustomCsrfMiddleware',
]

ROOT_URLCONF = 'restapi.urls'
WSGI_APPLICATION = 'restapi.wsgi.application'

# ----------------------------------- Misc ----------------------------------- #

FIXTURE_DIRS = [
    Path(BASE_DIR, 'restapi', 'fixtures').as_posix(),
]

# --------------------------------- Debugging -------------------------------- #

SILK_DEBUG = False
DEBUG = False

# ----------------------------------- Csrf ----------------------------------- #

CSRF_COOKIE_NAME = 'csrftoken'
CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN'
CSRF_COOKIE_AGE = 60 * 60 * 24 * 30  # 1 month
CSRF_SAMESITE = 'lax'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False

# ---------------------------- 3rd Party Services ---------------------------- #

# Ory
ORY_AUTH_HEADER = 'HTTP_AUTHORIZATION'
ORY_AUTH_SCHEME = 'Api-Key'

# Oathkeeper
OATHKEEPER_AUTH_HEADER = 'HTTP_AUTHORIZATION'
OATHKEEPER_AUTH_SCHEME = 'Bearer'

# Plaid
PLAID_PRODUCTS = ['transactions', 'balance']
PLAID_COUNTRY_CODES = ['US']

# ---------------------------------- Caching --------------------------------- #

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

# ------------------------------- Auth Settings ------------------------------ #

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'restapi.auth.ory.OryBackend',
    )
}

AUTH_USER_MODEL = 'core.User'

SESSION_MAX_AGE_SECONDS = 60 * 10 # 10 minutes in seconds

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

# ---------------------------------- Logging --------------------------------- #

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
            'filename': os.path.join(BASE_DIR, 'logs/ledget_logs'),
            'formatter': 'verbose',
        },
        'stripe': {
            'level': LOG_LEVEL,
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/stripe_logs'),
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
        'plaid': {
            'handlers': ['file', 'console'],
            'levels': LOG_LEVEL
        }
    }
}
