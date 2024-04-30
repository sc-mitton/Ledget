from django.core.exceptions import ValidationError


class ValidationError500(ValidationError):
    status_code = 500
