from django.contrib.auth import authenticate
from django.conf import settings

import jwt


def get_user(request):
    decoded_token = jwt.decode(
        request.COOKIES.get('access'),
        settings.SECRET_KEY,
        algorithms=['HS256']
    )
    user = authenticate(
        request, **decoded_token
    )
    return user
