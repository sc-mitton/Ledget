import os
from dotenv import load_dotenv
from pathlib import Path
from .base import * # noqa

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent.parent

DEBUG = True

DOMAIN_URL = "https://ledget.app:8000/"

STRIPE_SK = os.getenv('STRIPE_SK_TEST')
STRIPE_PK = os.getenv('STRIPE_PK_TEST')

# SSL certificate and key for development server
SSL_CERTIFICATE_PATH = BASE_DIR / 'ssl' / 'ledget.app.crt'
SSL_KEY_PATH = BASE_DIR / 'ssl' / 'ledget.app.key'

ALLOWED_HOSTS = ['ledget.app', '127.0.0.1', 'localhost']
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True
SECURE_BROWSER_XSS_FILTER = True
