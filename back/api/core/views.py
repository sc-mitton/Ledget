from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import stripe
import logging


stripe.api_key = settings.STRIPE_API_KEY
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
stripe_logger = logging.getLogger('core.stripe')


class PriceView(APIView):
    """Class for getting the list of prices from Stripe"""

    def get(self, request, *args, **kwargs):
        result = stripe.Price.search(
            query="product:'prod_NStMoPQOCocj2H' AND active:'true'",
        )
        return Response(data=result.data)


class StripeHookView(APIView):
    """Class for handling the Stripe webhook"""

    def post(self, request, *args, **kwargs):
        pass
