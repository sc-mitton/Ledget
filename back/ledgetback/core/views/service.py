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

from core.serializers import (
    SubscriptionSerializer,
    PaymentMethodSerializer
)
from core.utils.stripe import stripe_error_handler, StripeError
from core.models import Customer


stripe.api_key = settings.STRIPE_API_KEY
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
stripe_logger = logging.getLogger('stripe')


class PriceView(APIView):
    """Class for getting the list of prices from Stripe"""

    def get(self, *args, **kwargs):
        keys = ['id', 'nickname', 'unit_amount',
                'unit_amount', 'currency', 'metadata']
        prices = stripe.Price.search(
            query="product:'prod_NStMoPQOCocj2H' AND active:'true'",
        ).data

        filtered_data = [
            {key: price[key] for key in keys} for price in prices
        ]

        return Response(data=filtered_data, status=HTTP_200_OK)


class SubscriptionView(GenericAPIView):
    """Class for handling the subscription"""
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def delete(self, request, *args, **kwargs):
        try:
            sub_id = stripe.Subscription.list(
                customer=request.user.customer.id
            ).data[0].id
            stripe.Subscription.modify(sub_id, cancel_at_period_end=True)
            response = Response(status=HTTP_200_OK)
        except Exception as e:
            stripe_logger.error(f'Error canceling subscription: {e}')
            response = Response(status=HTTP_400_BAD_REQUEST)

        return response

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
            'payment_behavior': 'default_incomplete'
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


class GetSetupIntent(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        setup_intent = stripe.SetupIntent.create(
            customer=request.user.customer.id
        )
        return Response(
            data={'client_secret': setup_intent.client_secret},
            status=HTTP_200_OK
        )


class PaymentMethodView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = [PaymentMethodSerializer]

    def post(self, request, *args, **kwargs):
        '''
        Set the default payment method for the customer
        '''
        serializer = self.get_serializer(data=request.data)
        data = serializer.is_valid(raise_exception=True)

        try:
            stripe.Customer.modify(
                self.request.user.customer.id,
                invoice_settings={
                    'default_payment_method':
                    data['payment_method_id']
                }
            )
            stripe.PaymentMethod.detach(data['old_payment_method_id'])
        except Exception as e:
            stripe_logger.error(f'Error setting default payment method: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(status=HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        '''
        Get the default payment method for the customer
        '''

        try:
            payment_methods = self.get_default_stripe_payment_methods(
                request.user.customer.id
            )
            payment_method = {
                'id': payment_methods.data[0].id,
                'brand': payment_methods.data[0].card.brand,
                'exp_month': payment_methods.data[0].card.exp_month,
                'exp_year': payment_methods.data[0].card.exp_year,
                'last4': payment_methods.data[0].card.last4,
            }
        except StripeError:
            stripe_logger.error(StripeError.message)
            return Response(
                {'error': StripeError.message},
                status=StripeError.response_code
            )

        return Response(
            data={'payment_method': payment_method},
            status=HTTP_200_OK
        )

    @stripe_error_handler
    def get_default_stripe_payment_methods(self, customer_id):
        return stripe.PaymentMethod.list(customer=customer_id)


