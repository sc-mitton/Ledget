import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_200_OK,
)
import stripe
from core.utils.stripe import stripe_error_handler, StripeError

stripe_logger = logging.getLogger('stripe')


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
