from pathlib import Path
from .base import * # noqa
from corsheaders.defaults import default_headers

DEBUG = True

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ALLOWED_HOSTS = ['localhost', 'ledget.app']
DOMAIN_URL = "https://ledget.app:8000/"
REACT_URL = "https://ledget.app:3001/"

# SSL certificate and key for development server
SSL_CERTIFICATE_PATH = BASE_DIR / '..' / '.ssl' / 'ledget.app.cert'
SSL_KEY_PATH = BASE_DIR / '..' / '.ssl' / 'ledget.app.key'

ALLOWED_HOSTS = ['ledget.app', '127.0.0.1', 'localhost']
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True
SECURE_BROWSER_XSS_FILTER = True


CORS_ORIGIN_WHITELIST = [
    'https://localhost:3001',
    'https://localhost:3000',
]
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
CORS_ALLOW_HEADERS = list(default_headers) + ['Set-Cookie']
CORS_ALLOW_CREDENTIALS = True
