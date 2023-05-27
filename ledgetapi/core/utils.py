from django.contrib.auth import authenticate
from django.conf import settings

import jwt
import time


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


def timeit(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(
            f"{func.__name__} took "
            f"{end_time - start_time:.2f} seconds to execute."
        )
        return result
    return wrapper
