import logging

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
from core.models import Customer
from core.permissions import IsUserOwner


stripe.api_key = settings.STRIPE_API_KEY
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
stripe_logger = logging.getLogger('core.stripe')


class PriceView(APIView):
    """Class for getting the list of prices from Stripe"""

    def get(self, *args, **kwargs):
        result = stripe.Price.search(
            query="product:'prod_NStMoPQOCocj2H' AND active:'true'",
        )
        return Response(data=result.data, status=HTTP_200_OK)


class CustomerView(APIView):
    permission_classes = [IsAuthenticated, IsUserOwner]

    def post(self, request, *args, **kwargs):
        if not request.user:
            return Response(status=HTTP_400_BAD_REQUEST)

        email = request.user.traits.get('email')
        first_name = request.user.traits.get('name', {}).get('first')
        last_name = request.user.traits.get('name', {}).get('last')

        try:
            stripe_customer = stripe.Customer.create(
                email=email, name=f'{first_name} {last_name}'
            )
            Customer.objects.create(
                user=request.user,
                id=stripe_customer.id
            ).save()
        except Exception as e:
            return Response(
                data={'error': str(e)},
                status=HTTP_400_BAD_REQUEST
            )

        return Response(status=HTTP_200_OK)


class SubscriptionView(CreateAPIView):
    """Class for handling the subscription creation and updating"""
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            stripe_subscription = serializer.create_stripe_subscription()
        except stripe.error.InvalidRequestError as e:
            response = Response(
                data={'error': str(e)},
                status=HTTP_400_BAD_REQUEST,
                content_type='application/json'
            )

        else:
            response = Response(
                {'client_secret':
                    stripe_subscription.pending_setup_intent.client_secret},
                status=HTTP_200_OK,
                content_type='application/json'
            )

        return response
