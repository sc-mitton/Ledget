import logging

from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_200_OK
)
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.conf import settings
import stripe

from core.serializers import (
    NewSubscriptionSerializer,
    PaymentMethodSerializer,
    SubscriptionUpdateSerializer,
    SubscriptionItemsSerializer
)
from core.utils.stripe import stripe_error_handler, StripeError
from core.models import Customer
from core.permissions import (
    OwnsStripeSubscription,
    can_create_stripe_subscription,
    IsAuthenticated
)


stripe.api_key = settings.STRIPE_API_KEY
stripe_logger = logging.getLogger('stripe')


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


class UpateSubscriptionView(GenericAPIView):
    permission_classes = [IsAuthenticated, OwnsStripeSubscription]
    serializer_class = SubscriptionUpdateSerializer

    def post(self, request, *args, **kwargs):
        '''
        Stop cancelation of the subscription at the end of the period
        '''
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            stripe.Subscription.modify(
                kwargs.get('id', ''),
                **serializer.validated_data
            )
            return Response(status=HTTP_200_OK)
        except Exception as e:
            stripe_logger.error(f'Error updating subscription: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        '''
        Cancel the subscription at the end of the period
        '''
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.customer.feedback = \
            serializer.validated_data.pop('feedback', '')
        request.user.customer.cancelation_reason = \
            serializer.validated_data.pop('cancelation_reason', '')

        try:
            stripe.Subscription.modify(
                kwargs.get('sub_id', ''),
                **serializer.validated_data
            )
            request.user.customer.save()

            return Response(status=HTTP_200_OK)
        except Exception as e:
            stripe_logger.error(f'Error canceling subscription: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)


class SubscriptionItemsView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionItemsSerializer

    def put(self, request, *args, **kwargs):
        '''
        Update the subscription items by adding the new subscription
        and deleting the old one
        '''
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            sub = self.get_current_sub(self.request.user.customer.id)
            stripe.SubscriptionItem.modify(
                sub['items'].data[0].id,
                **serializer.validated_data
            )
        except Exception as e:
            stripe_logger.error(f'Error updating subscription items: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(status=HTTP_200_OK)

    def get_current_sub(self, customer_id):
        active_sub = stripe.Subscription.list(
            customer=customer_id,
            status='active'
        ).data[0]
        return active_sub


class SubscriptionView(GenericAPIView):
    """Class for handling creating a subscription"""
    permission_classes = [IsAuthenticated]
    serializer_class = NewSubscriptionSerializer

    def get(self, request, *args, **kwargs):
        '''
        Get the current subscription for the user
        '''
        try:
            sub = self._get_stripe_subscription(request.user.customer.id)
        except StripeError as e:
            stripe_logger.error(e.message)
            return Response(status=e.response_code)

        return Response(
            data={
                'id': sub.id,
                'status': sub.status,
                'current_period_end': sub.current_period_end,
                'cancel_at_period_end': sub.cancel_at_period_end,
                'plan': {
                    'id': sub.plan.id,
                    'amount': sub.plan.amount,
                    'nickname': sub.plan.nickname,
                    'interval': sub.plan.interval,
                }
            },
            status=HTTP_200_OK
        )

    @can_create_stripe_subscription
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            stripe_subscription = self._create_subscription(
              customer=request.user.customer.id,
              **serializer.validated_data
            )
        except Exception as e:
            return Response({'error': str(e)}, HTTP_400_BAD_REQUEST)

        pending_setup_intent = stripe_subscription.pending_setup_intent
        if pending_setup_intent:
            return Response(
                {'client_secret': pending_setup_intent.client_secret},
                HTTP_200_OK
            )
        else:
            return Response(status=HTTP_200_OK)

    @stripe_error_handler
    def _get_stripe_subscription(self, customer_id):
        subs = stripe.Subscription.list(customer=customer_id)
        sub = next((s for s in subs if s.status == 'active'), None) or subs.data[0]
        return sub

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
                request.user.customer.id)
            payment_method = {
                'id': payment_methods.data[0].id,
                'brand': payment_methods.data[0].card.brand,
                'exp_month': payment_methods.data[0].card.exp_month,
                'exp_year': payment_methods.data[0].card.exp_year,
                'last4': payment_methods.data[0].card.last4,
            }
        except StripeError as e:
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
                customer=request.user.customer.id
            )
            customer = stripe.Customer.retrieve(request.user.customer.id)
            data = {
                'next_payment': invoice.lines.data[0].amount,
                'next_payment_date': invoice.next_payment_attempt,
                'balance': customer.balance,
            }
        except Exception as e:
            stripe_logger.error(f'Error getting upcoming invoice: {e}')
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(data, HTTP_200_OK)
