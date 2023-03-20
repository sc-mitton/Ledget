from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED
)
from django.conf import settings
import stripe

from core.serializers import CustomerSerializer
from core.models import Customer

stripe.api_key = settings.STRIPE_SK
CHECKOUT_DOMAIN = settings.DOMAIN_URL + 'checkout/'


class CustomerView(CreateAPIView):
    """Class for creating new customers in Stripe and in the database."""

    serializer_class = CustomerSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            response = Response(serializer.errors, HTTP_400_BAD_REQUEST)
        else:
            stripe_customer = stripe.Customer.create()

            first_name = serializer.validated_data.get('first_name')
            last_name = serializer.validated_data.get('last_name')
            customer = Customer.objects.create(
                stripe_customer.id,
                first_name,
                last_name
            )
            customer.save()

            response = Response(HTTP_201_CREATED)

        return response


class Subscription(APIView):

    def post(self, request, *args, **kwargs):
        pass

    def put(self, request, *args, **kwargs):
        """Updating the status of the subscription to cancelled."""
        pass


class CheckoutSession(APIView):

    def post(self, request, *args, **kwargs):
        pass
