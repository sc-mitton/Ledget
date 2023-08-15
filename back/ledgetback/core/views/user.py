import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_200_OK,
)
import stripe

from core.utils.stripe import stripe_error_handler, StripeError
from core.permissions import UserPermissionBundle

stripe_logger = logging.getLogger('stripe')


class UserView(APIView):
    """Get me endpoint, returns user data and subscription data"""
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        try:
            sub = self.get_stripe_subscription(request.user.customer.id)
            subscription_data = {
                'plan': {
                    'nickname': sub.data[0].plan.nickname,
                    'status': request.user.customer.subscription_status,
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
                'id': request.user.id,
                'email': request.user.traits.get('email', ''),
                'name': request.user.traits.get('name', {}),
                'is_customer': request.user.is_customer,
                'is_verified': request.user.is_verified,
                'subscription': subscription_data
            },
            status=HTTP_200_OK
        )

    @stripe_error_handler
    def get_stripe_subscription(self, customer_id):
        return stripe.Subscription.list(customer=customer_id)


class PaymentMethodView(APIView):
    permission_classes = [UserPermissionBundle]

    def get(self, request, *args, **kwargs):
        try:
            payment_methods = self.get_stripe_payment_methods(
                request.user.customer.id
            )
            payment_method = {
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
    def get_stripe_payment_methods(self, customer_id):
        return stripe.PaymentMethod.list(customer=customer_id)
