import os
from dotenv import load_dotenv
from pathlib import Path
from .base import * # noqa

DEBUG = True

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ALLOWED_HOSTS = ['localhost', 'ledget.app']

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

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://localhost:3000',
    'https://localhost:8000',
    'https://ledget.app:8000',
    'https://ledget.app:3000',
]
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
