from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
)
from django.conf import settings
import stripe
from django.contrib.auth.mixins import LoginRequiredMixin

from core.models import Customer

stripe.api_key = settings.STRIPE_SK
CHECKOUT_DOMAIN = settings.DOMAIN_URL + 'checkout/'


def create_customer(request):
    """Create a Stripe customer in stripe and the database."""
    customer = stripe.Customer.create(
        email=request.user.email,
        name=request.user.get_full_name(),
        address={
            "country": "US",
            "city": request.user.billing_info.city,
            "postal_code": request.user.billing_info.postal_code
        }
    )
    Customer.objects.create(
        user=request.user,
        stripe_id=customer.get('id'),
    )
    return customer


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
                    'trial_period_days': price.get('metadata')
                                              .get('trial_period_days')
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


class SubscriptionView(LoginRequiredMixin, APIView):
    """Class for handling the subscription creation and updating"""
    def post(self, request, *args, **kwargs):
        if not request.data.get('price'):
            return Response(HTTP_400_BAD_REQUEST)

        customer = create_customer(request)
        subscription = stripe.Subscription.create(
            customer=customer.customer_id,
            items=[{
                'price': request.data.get('price')
            }],
            payment_behaviour='default_incomplete',
            payment_settings={
                'save_default_payment_method': 'on_subscription'
            },
            trial_period_days=request.data.get('price')
                                          .get('trial_period_days')
        )
        payload = {
            'subscriptionId': subscription.id,
            'clientSecret': subscription.latest_invoice.payment_intent.client_secret # noqa
        }
        return Response(payload, HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        """Updating the status of the subscription to cancelled."""
        pass


class StripeHookView(APIView):
    """Class for handling the Stripe webhook"""
    def post(self, request, *args, **kwargs):
        pass
