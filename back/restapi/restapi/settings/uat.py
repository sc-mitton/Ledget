from .base import *
from .prod import *

ALLOWED_HOSTS = ['ledget.app']
DOMAIN_URL = "https://uatapi.ledget.app/"
DOMAIN = 'uatapi.ledget.app'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
