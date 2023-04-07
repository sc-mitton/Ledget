from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
)
from django.conf import settings

import stripe

from core.serializers import SubscriptionSerializer


stripe.api_key = settings.STRIPE_SK


class PriceView(APIView):
    """Class for getting the list of prices from Stripe"""
    permission_classes = [IsAuthenticated]

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

    def get_prices(self, request):
        lookup_key = request.data.get('lookup_key', None)
        price_list = stripe.Price.list(lookup_key=lookup_key).get('data')
        prices = []
        for price in price_list:
            prices.append(
                {
                    'price_id': price.get('id'),
                    'lookup_key': price.get('lookup_key'),
                    'unit_amount': price.get('unit_amount'),
                    'description': price.get('metadata').get('description'),
                    'renews': price.get('metadata').get('renews'),
                    'trial_period_days': price.get('metadata')
                                              .get('trial_period_days')
                }
            )
        return prices


class SubscriptionView(CreateAPIView):
    """Class for handling the subscription creation and updating"""
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription = serializer.save()
        data = {
            'client_secret': subscription.pending_setup_intent.client_secret
        }
        return Response(
            data,
            status=HTTP_200_OK,
            content_type='application/json'
        )


class StripeHookView(APIView):
    """Class for handling the Stripe webhook"""

    def post(self, request, *args, **kwargs):

        webhook_secret = settings.STRIPE_WH_SECRET_TEST
        request_data = request.data

        if webhook_secret:
            # Retrieve the event by verifying the signature using
            # the raw body and secret if webhook signing is configured.
            signature = request.headers.get('stripe-signature')
            try:
                event = stripe.Webhook.construct_event(
                    payload=request.data,
                    sig_header=signature,
                    secret=webhook_secret
                )
                data = event['data']
            except Exception as e:
                return e
            # Get the type of webhook event sent - used to
            # check the status of PaymentIntents.
            event_type = event['type']
        else:
            data = request_data['data']
            event_type = request_data['type']

        data_object = data['object']

        if event_type == 'invoice.paid':
            # Used to provision services after the trial has ended.
            # The status of the invoice will show up as paid. Store the
            # status in your database to reference when a user accesses
            # your service to avoid hitting rate limits.
            print("hello world")
            print(data)

        if event_type == 'invoice.payment_failed':
            # If the payment fails or the customer does not have a valid
            # payment method, an invoice.payment_failed event is sent, the
            # subscription becomes past_due. Use this webhook to notify your
            # user that their payment has failed and to retrieve new card
            # details.
            print("hello world")
            print(data)

        if event_type == 'customer.subscription.deleted':
            # handle subscription canceled automatically based
            # upon your subscription settings. Or if the user cancels it.
            print("hello world")
            print(data)

        return Response(status=HTTP_200_OK)
