from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
)
from django.conf import settings
import stripe

from core.mixins import JWTAuthMixin


stripe.api_key = settings.STRIPE_SK
CHECKOUT_DOMAIN = settings.DOMAIN_URL + 'checkout/'


class PriceView(APIView):
    """Class for getting the list of prices from Stripe"""

    def get_prices(self, request):
        lookup_key = request.data.get('lookup_key', None)
        price_list = stripe.Price.list(lookup_key=lookup_key).get('data')
        prices = []
        for price in price_list:
            prices.append(
                {
                    'lookup_key': price.get('lookup_key'),
                    'unit_amount': price.get('unit_amount'),
                    'description': price.get('metadata').get('description'),
                    'renews': price.get('metadata').get('renews'),
                }
            )
        return prices

    def get(self, request, *args, **kwargs):
        """Getting the list of prices from Stripe"""
        try:
            prices = self.get_prices(request)
            payload = {'prices': prices, 'status': 'success'}
            response = Response(
                payload,
                status=HTTP_200_OK,
                content_type='application/json'
            )
            return response
        except Exception as e:
            return Response({'error': e}, status=HTTP_400_BAD_REQUEST)


class Subscription(APIView):

    def post(self, request, *args, **kwargs):
        pass

    def put(self, request, *args, **kwargs):
        """Updating the status of the subscription to cancelled."""
        pass


class SubscriptionView(APIView, JWTAuthMixin):
    """Class for handling the subscription creation and updating"""
    pass
