from jwt import decode
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
from django.conf import settings


class CustomOryMiddleware(MiddlewareMixin):

    def process_request(self, request):
        # decode jwt from the request Authorization header
        # and set the user in the request object
        user = get_user_model(
            id=decode(
                request.headers['Authorization'].split(' ')[1],
                secret=settings.ORY_JWT_SECRET,
                algorithms=['HS256'],
            )
        )
        request.user = user

    def process_response(self, request, response):
        return response
