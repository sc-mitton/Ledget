import logging

from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_200_OK,
)
import stripe
from django.contrib.auth.models import AnonymousUser

from core.serializers import OnboardUpdateSerializer
from core.utils.stripe import stripe_error_handler, StripeError
from core.permissions import IsObjectOwner

stripe_logger = logging.getLogger('stripe')


class UserView(RetrieveUpdateAPIView):
    """Get me endpoint, returns user data and subscription data"""
    permission_classes = [IsAuthenticated, IsObjectOwner]
    serializer_class = OnboardUpdateSerializer

    def get(self, request, *args, **kwargs):

        try:
            sub = self.get_stripe_subscription(request.user.customer.id)
            subscription_data = {
                'id': sub.id,
                'plan': {
                    'id': sub.plan.id,
                    'nickname': sub.plan.nickname,
                    'status': request.user.customer.subscription_status,
                    'current_period_end': sub.current_period_end,
                    'amount': sub.plan.amount,
                    'cancel_at_period_end': sub.cancel_at_period_end,
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
                'is_onboarded': request.user.is_onboarded,
                'service_provisioned_until':
                    request.user.service_provisioned_until,
                'subscription': subscription_data
            },
            status=HTTP_200_OK
        )

    @stripe_error_handler
    def get_stripe_subscription(self, customer_id):
        subs = stripe.Subscription.list(customer=customer_id)
        if len(subs) > 0:
            sub = subs.data[0]
        else:
            sub = subs.data[0]

        return sub

    def get_object(self):
        u = AnonymousUser()
        u.id = self.kwargs['id']
        self.check_object_permissions(self.request, u)
        return self.request.user
