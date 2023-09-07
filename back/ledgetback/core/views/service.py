import logging

from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_200_OK
)
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import stripe

from core.serializers import SubscriptionSerializer
from core.models import Customer


stripe.api_key = settings.STRIPE_API_KEY
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
stripe_logger = logging.getLogger('stripe')


class PriceView(APIView):
    """Class for getting the list of prices from Stripe"""

    def get(self, *args, **kwargs):
        result = stripe.Price.search(
            query="product:'prod_NStMoPQOCocj2H' AND active:'true'",
        )
        return Response(data=result.data, status=HTTP_200_OK)


class CreateSubscriptionView(GenericAPIView):
    """Class for handling the subscription"""
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def post(self, request, *args, **kwargs):
        if not request.user.is_customer \
           or request.user.subscription_status is not None:
            return Response(status=HTTP_422_UNPROCESSABLE_ENTITY)

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            stripe_subscription = self.create_subscription(
              customer_id=request.user.customer.id,
              price_id=serializer.validated_data['price_id'],
              trial_period_days=serializer.validated_data['trial_period_days']
            )
        except Exception as e:
            return Response(
                data={'error': str(e)},
                status=HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                'client_secret':
                stripe_subscription.pending_setup_intent.client_secret
            },
            status=HTTP_200_OK,
            content_type='application/json'
        )

    def create_subscription(self, customer_id, price_id, trial_period_days):

        args = {
            'payment_behavior': 'default_incomplete',
            'payment_settings': {
                'save_default_payment_method': 'on_subscription'
            },
            'expand': [
                'pending_setup_intent'
            ],
            'proration_behavior': 'none',
            # 'automatic_tax': {"enabled": True},
            # deactivated for now, reactivate in production
        }

        if trial_period_days:
            args['trial_period_days'] = trial_period_days

        stripe_subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[{'price': price_id}],
            **args
        )
        return stripe_subscription


class CreateCustomerView(APIView):
    """Class for creating a Stripe customer"""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if request.user.is_customer:
            return Response(
                {'error': 'user is already customer'},
                status=HTTP_422_UNPROCESSABLE_ENTITY
            )

        email = request.user.traits.get('email', '')
        first_name = request.user.traits.get('name', {}).get('first', '')
        last_name = request.user.traits.get('name', {}).get('last', '')

        try:
            stripe_customer = stripe.Customer.create(
                email=email,
                name=f'{first_name} {last_name}'
            )
            Customer.objects.create(
                user=request.user,
                id=stripe_customer.id
            ).save()
        except Exception as e:
            stripe_logger.error(f'Error creating customer: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(status=HTTP_200_OK)


class CreateCheckoutSession(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            mode=['setup'],
            customer=request.user.customer.id,
            setup_intent_data={
                'metadata': {
                    'subscription_id':
                    self.getSubscriptionId(request.user.customer.id)
                }
            }
        )
        return Response(data={'session': session}, status=HTTP_200_OK)

    def getSubscriptionId(self, customer_id):
        customer = stripe.Customer.retrieve(customer_id)
        return customer.subscriptions.data[0].id
