from pathlib import Path
import os
import sys
import subprocess


def get_django_secret_key():
    with open('/run/secrets/django_secret_key', 'r') as f:
        return f.read().strip()


def get_stripe_api_key():
    with open('/run/secrets/stripe_api_key', 'r') as f:
        return f.read().strip()


def get_stripe_webhook_secret():
    with open('/run/secrets/stripe_webhook_secret', 'r') as f:
        return f.read().strip()


def get_db_user():
    with open('/run/secrets/postgres_user', 'r') as f:
        return f.read().strip()


def get_db_password():
    with open('/run/secrets/postgres_password', 'r') as f:
        return f.read().strip()


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_django_secret_key()
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DOMAIN = 'ledget.app'

APPEND_SLASH = False
SITE_ID = 1


# Stripe
STRIPE_API_KEY = get_stripe_api_key()
STRIPE_WEBHOOK_SECRET = get_stripe_webhook_secret()

# Postgres
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
        'USER': get_db_user(),
        'PASSWORD': get_db_password(),
    }
}

# -------------------------------------------------------------- #
#                  Application Defenition                        #
# -------------------------------------------------------------- #

DEFAULT_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.sites',
    'django.contrib.staticfiles',
]
THIRD_PARTY_APPS = [
    'sslserver',
    'rest_framework',
    'corsheaders'
]
LOCAL_APPS = [
    'core.apps.CoreConfig',
    'spending.apps.SpendingConfig',
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

ROOT_URLCONF = 'api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'core' / 'templates',
        ],
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

STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
STATIC_URL = '/static/'

WSGI_APPLICATION = 'api.wsgi.application'


# ---------------------------------------------------------------- #
#                 Authentication Settings                          #
# ---------------------------------------------------------------- #

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', # noqa
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', # noqa
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', # noqa
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', # noqa
    },
]

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher'
]

AUTH_USER_MODEL = 'core.User'

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
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
            'filename': os.path.join(BASE_DIR, 'logs/debug.log'),
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
        'core.stripe': {
            'handlers': ['stripe', 'console'],
            'levels': LOG_LEVEL
        },
    }
}

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
