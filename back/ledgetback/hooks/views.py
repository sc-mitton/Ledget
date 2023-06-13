from rest_framework.views import APIView
from rest_framework_api_key.permissions import HasAPIKey

# Create your views here.
class StripeHookView(APIView):
    """Class for handling the Stripe webhook"""

    def post(self, request, *args, **kwargs):
        pass


class OryHookView(APIView):
    """Class for handling the Ory webhook"""
    permission_classes = [HasAPIKey]

    def post(self, request, *args, **kwargs):
        pass
