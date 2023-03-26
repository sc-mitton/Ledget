from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_200_OK,
)
from django.conf import settings
import stripe

from core.models import Customer
from core.mixins import JWTAuthMixin
from core.utils import get_user

from datetime import datetime, timedelta

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

    def get_trial_end(self):
        now = datetime.now()

        trial_end = now + timedelta(days=14)
        trial_end = trial_end.replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        trial_end = trial_end + datetime.timedelta(days=1)
        return int(trial_end.timestamp())

    def create_customer(self, request):
        """Creating a new customer in the database and Stripe"""

        user = get_user(request=request)
        if request.data['free-trial'] == 'true':
            trial_end = self.get_trial_end()

        stripe_customer = stripe.Customer.create(
            email=user.email,

        )
        customer = Customer.objects.create(
            user=user,
            stripe_customer_id=stripe_customer.id,
            trial_end=trial_end
        )

        return customer

    def post(self, request, *args, **kwargs):

        try:
            prices = stripe.Price.list(
                lookup_keys=[request.data['subscription-type']],
                expand=['data.product']
            )
            customer = self.create_customer(request)

            subscription = stripe.Subscription.create(
                customer=customer.stripe_customer_id,
                items=[{'price': prices.data[0].id}],
                payment_behavior='default_incomplete',
                payment_settings={
                    'save_default_payment_method': 'on_subscription'},
                trial_end=customer.trial_end,
                automatic_tax={"enabled": True},
            )
            payload = {
                'subscriptionId': subscription.id,
                'clientSecret':
                subscription.latest_invoice.payment_intent.client_secret
            }

            response = Response(
                payload,
                status=HTTP_201_CREATED,
                content_type='application/json'
            )

            return response

        except Exception as e:
            return Response({'error': e}, status=HTTP_400_BAD_REQUEST)
