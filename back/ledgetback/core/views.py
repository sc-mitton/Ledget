import logging

from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
    HTTP_422_UNPROCESSABLE_ENTITY,
)
from django.conf import settings
import stripe

from core.serializers import SubscriptionSerializer
from core.models import Customer
from core.permissions import IsUserOwner
from core.utils.stripe import stripe_error_handler, StripeError


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


class CustomerView(APIView):
    permission_classes = [IsAuthenticated, IsUserOwner]

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


class SubscriptionView(GenericAPIView):
    """Class for handling the subscription creation and updating"""
    permission_classes = [IsAuthenticated, IsUserOwner]
    serializer_class = SubscriptionSerializer

    def post(self, request, *args, **kwargs):
        if not request.user.is_customer:
            return Response(
                {'error': 'Customer does not exist.'},
                status=HTTP_422_UNPROCESSABLE_ENTITY
            )

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


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        try:
            sub = self.get_stripe_subscription(request.user.customer.id)
            subscription_data = {
                'plan': {
                    'nickname': sub.data[0].plan.nickname,
                    'status': request.user
                                     .customer
                                     .get_subscription_status_display(),
                    'current_period_end': sub.data[0].current_period_end,
                    'amount': sub.data[0].plan.amount,
                },
            }
        except StripeError:
            stripe_logger.error(StripeError.message)
            return Response(
                {'error': StripeError.message},
                status=StripeError.response_code
            )

        return Response(
            data={
                'email': request.user.traits.get('email', ''),
                'name': request.user.traits.get('name', {}),
                'is_customer': request.user.is_customer,
                'verified': request.user.verified,
                'subscription': subscription_data
            },
            status=HTTP_200_OK
        )

    @stripe_error_handler
    def get_stripe_subscription(self, customer_id):
        return stripe.Subscription.list(customer=customer_id)
