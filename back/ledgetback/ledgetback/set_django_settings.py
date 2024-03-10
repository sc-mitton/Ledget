import os


def set_django_settings():
    ENVIRONMENT = os.environ.get('ENVIRONMENT', '')
    if ENVIRONMENT == 'dev':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ledgetback.settings.dev')
    elif ENVIRONMENT == 'uat':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ledgetback.settings.uat')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ledgetback.settings.prod')
