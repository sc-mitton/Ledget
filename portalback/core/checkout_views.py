from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
)
from django.conf import settings
import stripe

from core.models import (
    Customer,
    Price
)
from core.serializers import (
    SubscriptionSerializer,
    PriceSerializer
)

import threading

stripe.api_key = settings.STRIPE_SK
endpoint_secret = settings.STRIPE_ENDPOINT_SECRET_TEST


class PriceView(ListAPIView):
    """Class for getting the list of prices from Stripe"""
    permission_classes = [IsAuthenticated]
    queryset = Price.objects.all().filter(active=True)
    serializer_class = PriceSerializer


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

        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']

        event = None
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook signature verification failed.' + str(e))
            return Response(status=HTTP_400_BAD_REQUEST)
        except ValueError as e:
            print('⚠️  Invalid payload' + str(e))
            return Response(status=HTTP_400_BAD_REQUEST)

        # Handle the event
        t = threading.Thread(
            target=self.handle_event,
            args=(event,)
        )
        t.start()

        return Response(status=HTTP_200_OK)

    def handle_event(self, event):
        print('\n')
        print(event['type'])
        print('\n')
