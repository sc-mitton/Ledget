import logging

from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_200_OK
)
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, CreateAPIView
from rest_framework.response import Response
from django.conf import settings
import stripe
from django.db import transaction

from core.serializers.user import (
    NewSubscriptionSerializer,
    PaymentMethodSerializer,
    SubscriptionItemsSerializer,
    FeedbackSerializer,
)
from core.serializers.account import DeleteRestartSubscriptionSerializer
from core.serializers.subscription import StripeSubscriptionSerializer
from core.utils.stripe import stripe_error_handler, StripeError
from core.models import Customer, Feedback
from restapi.permissions.auth import can_create_stripe_subscription, IsAuthenticated
from restapi.permissions.checks import HasCustomer
from restapi.permissions.objects import OwnsStripeSubscription, is_account_owner

stripe.api_key = settings.STRIPE_API_KEY
stripe_logger = logging.getLogger("stripe")


@stripe_error_handler
def _get_stripe_subscription(customer_id):
    subs = stripe.Subscription.list(customer=customer_id)
    sub = next((s for s in subs if s.status in ['active', 'trialing']), None) or \
        subs.data[0]
    return sub


def get_current_subscription_id(customer_id):
    sub = _get_stripe_subscription(customer_id)
    return sub['items'].data[0].id


class PriceView(APIView):
    """Class for getting the list of prices from Stripe"""

    def get(self, *args, **kwargs):
        keys = ['id', 'nickname', 'unit_amount',
                'unit_amount', 'currency', 'metadata']
        prices = stripe.Price.search(
            query="product:'prod_NStMoPQOCocj2H' AND active:'true'",
        ).data

        filtered_data = []
        for price in prices:
            data = {key: price[key] for key in keys}
            data['interval'] = price['recurring']['interval']
            filtered_data.append(data)

        return Response(data=filtered_data, status=HTTP_200_OK)


class FeedbackView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FeedbackSerializer


class DeleteRestartSubscriptionView(GenericAPIView):
    permission_classes = [IsAuthenticated, OwnsStripeSubscription]
    serializer_class = DeleteRestartSubscriptionSerializer

    def patch(self, request, *args, **kwargs):
        '''
        Stop cancelation of the subscription at the end of the period
        '''
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            stripe.Subscription.modify(
                kwargs.get('id', ''),
                cancel_at_period_end=serializer.validated_data['cancel_at_period_end']
            )
            return Response(status=HTTP_200_OK)
        except Exception as e:  # pragma: no cover
            stripe_logger.error(f'Error updating subscription: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

    @is_account_owner
    def delete(self, request, *args, **kwargs):
        '''
        Cancel the subscription at the end of the period
        '''

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.create_feedback(serializer)

        try:
            stripe.Subscription.modify(
                kwargs.get('id', ''),
                cancel_at_period_end=serializer.validated_data['cancel_at_period_end']
            )

            return Response(status=HTTP_200_OK)
        except Exception as e:  # pragma: no cover
            stripe_logger.error(f'Error canceling subscription: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

    def create_feedback(self, serializer):
        Feedback.objects.create(
            user=self.request.user,
            feedback=serializer.validated_data.pop('feedback'),
            cancelation_reason=serializer.validated_data.pop('cancelation_reason')
        )


class SubscriptionItemView(GenericAPIView):
    permission_classes = [IsAuthenticated, HasCustomer]
    serializer_class = SubscriptionItemsSerializer

    def put(self, request, *args, **kwargs):
        '''
        Update the subscription items by adding the new subscription
        and deleting the old one
        '''
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            sub_id = get_current_subscription_id(request.user.account.customer.id)
            stripe.SubscriptionItem.modify(sub_id, **serializer.validated_data)
        except Exception as e:  # pragma: no cover
            stripe_logger.error(f'Error updating subscription items: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(status=HTTP_200_OK)


class SubscriptionView(GenericAPIView):
    """
    Class for handling creating, and retrieving
    a stripe subscription
    """

    permission_classes = [IsAuthenticated]
    serializer_class = NewSubscriptionSerializer

    def get(self, request, *args, **kwargs):
        '''
        Get the current subscription for the user
        '''
        if not request.user.account.has_customer:  # pragma: no cover
            return Response(status=HTTP_200_OK)

        try:
            sub = _get_stripe_subscription(request.user.account.customer.id)
        except StripeError as e:  # pragma: no cover
            stripe_logger.error(e.message)
            return Response(status=e.response_code)

        serializer = StripeSubscriptionSerializer(sub)

        return Response(serializer.data, HTTP_200_OK)

    @can_create_stripe_subscription
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            stripe_subscription = self._create_subscription(
              customer=request.user.account.customer.id,
              **serializer.validated_data
            )
            pending_setup_intent = stripe_subscription.pending_setup_intent
            return Response({
                'client_secret': pending_setup_intent.client_secret,
                'identifier': self.request.user.traits['email']},
                HTTP_200_OK)
        except Exception as e:  # pragma: no cover
            return Response({'error': str(e)}, HTTP_400_BAD_REQUEST)

    def _create_subscription(self, **kwargs):
        default_args = {
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

        stripe_subscription = stripe.Subscription.create(
            items=[{'price': kwargs.pop('price_id')}],
            **kwargs,
            **default_args
        )
        return stripe_subscription


class CreateCustomerView(APIView):
    """Class for creating a Stripe customer"""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if request.user.account.has_customer:
            return Response(
                {'error': 'user is already customer'},
                status=HTTP_422_UNPROCESSABLE_ENTITY
            )

        try:
            self._create_customer()
        except Exception as e:  # pragma: no cover
            stripe_logger.error(f'Error creating customer: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(status=HTTP_200_OK)

    @transaction.atomic
    def _create_customer(self):
        stripe_customer = self._get_stripe_customer()

        customer = Customer.objects.create(
            user=self.request.user,
            id=stripe_customer.id
        )
        self.request.user.account.customer = customer
        self.request.user.account.save()

    def _get_stripe_customer(self):
        email = self.request.user.traits.get('email', '')
        first_name = self.request.user.traits.get('name', {}).get('first', '')
        last_name = self.request.user.traits.get('name', {}).get('last', '')

        stripe_customer = stripe.Customer.create(
            email=email,
            name=f'{first_name} {last_name}'
        )
        return stripe_customer


class GetSetupIntent(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        setup_intent = stripe.SetupIntent.create(
            customer=request.user.account.customer.id
        )
        return Response(
            data={'client_secret': setup_intent.client_secret},
            status=HTTP_200_OK
        )


class PaymentMethodView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentMethodSerializer

    def post(self, request, *args, **kwargs):
        '''
        Set the default payment method for the customer
        '''
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            stripe.Customer.modify(
                self.request.user.account.customer.id,
                invoice_settings={
                    'default_payment_method':
                    serializer.data['payment_method_id']
                }
            )
            stripe.PaymentMethod.detach(serializer.data['old_payment_method_id'])
        except Exception as e:  # pragma: no cover
            stripe_logger.error(f'Error setting default payment method: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(status=HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        '''
        Get the default payment method for the customer
        '''

        try:
            payment_methods = self.get_default_stripe_payment_methods(
                request.user.account.customer.id)
            payment_method = {
                'id': payment_methods.data[0].id,
                'brand': payment_methods.data[0].card.brand,
                'exp_month': payment_methods.data[0].card.exp_month,
                'exp_year': payment_methods.data[0].card.exp_year,
                'last4': payment_methods.data[0].card.last4,
            }
        except StripeError as e:  # pragma: no cover
            stripe_logger.error(e)
            return Response(
                {'error': e.message},
                status=e.response_code
            )

        return Response(
            data=payment_method,
            status=HTTP_200_OK
        )

    @stripe_error_handler
    def get_default_stripe_payment_methods(self, customer_id):
        return stripe.PaymentMethod.list(customer=customer_id)


class NextInvoice(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            invoice = stripe.Invoice.upcoming(
                customer=request.user.account.customer.id
            )
            customer = stripe.Customer.retrieve(request.user.account.customer.id)
            data = {
                'next_payment': invoice.lines.data[0].amount,
                'next_payment_date': invoice.next_payment_attempt,
                'balance': customer.balance,
            }
        except Exception as e:  # pragma: no cover
            stripe_logger.error(f'Error getting upcoming invoice: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(data, HTTP_200_OK)
