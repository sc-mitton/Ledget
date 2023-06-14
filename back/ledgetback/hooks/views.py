from secrets import compare_digest

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.transaction import atomic


# Create your views here.
class StripeHookView(APIView):
    """Class for handling the Stripe webhook"""

    def post(self, request, *args, **kwargs):
        pass


class OryHookView(APIView):
    """Class for handling the Ory webhook"""

    def post(self, request, *args, **kwargs):
        given_key = request.headers.get('Authorization')
        if not compare_digest(given_key, settings.ORY_API_KEY):
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            self.process_webhook_payload(request.data)
        except Exception as e:
            return Response(error=str(e), status=status.HTTP_400_BAD_REQUEST)

    @atomic
    def process_webhook_payload(self, payload):
        # create user in the database
        user = get_user_model().objects.create_user(
            id=payload['id'],
        )
        user.save()
