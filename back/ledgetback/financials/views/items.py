import json
import os

from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView
)
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_200_OK
from rest_framework.response import Response
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.item_remove_request import ItemRemoveRequest
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
import plaid

from core.permissions import (
    IsObjectOwner,
    highest_aal_freshness,
    IsAuthedVerifiedSubscriber
)
from core.clients import create_plaid_client
from financials.serializers.items import (
    ExchangePlaidTokenSerializer,
    PlaidItemsSerializer
)
from financials.models import PlaidItem

plaid_client = create_plaid_client()

PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')
PLAID_REDIRECT_URI_ONBOARDING = settings.PLAID_REDIRECT_URI_ONBOARDING
PLAID_REDIRECT_URI = settings.PLAID_REDIRECT_URI
PLAID_COUNTRY_CODES = settings.PLAID_COUNTRY_CODES

plaid_products = []
for product in PLAID_PRODUCTS:
    plaid_products.append(Products(product))


class PlaidLinkTokenView(APIView):
    permission_classes = [IsAuthedVerifiedSubscriber]

    def get(self, request, *args, **kwargs):
        if kwargs.get('is_onboarding', False):
            redirect_uri = PLAID_REDIRECT_URI_ONBOARDING
        else:
            redirect_uri = PLAID_REDIRECT_URI

        request_kwargs = {
            'client_name': 'Ledget',
            'country_codes': list(
                map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)
            ),
            'language': 'en',
            'redirect_uri': redirect_uri,
            'user': LinkTokenCreateRequestUser(
                client_user_id=str(request.user.id)
            )
        }

        if kwargs.get('item_id', False):
            request_kwargs['access_token'] = \
                PlaidItem.objects.get(id=kwargs['id']).access_token
            request_kwargs['update'] = {"account_selection_enabled": True}
        else:
            request_kwargs['products'] = plaid_products

        try:
            request = LinkTokenCreateRequest(**request_kwargs)
            response = plaid_client.link_token_create(request)
            return Response(data=response.to_dict(),
                            status=HTTP_200_OK)
        except plaid.ApiException as e:
            return Response(
                {'error': json.loads(e.body)},
                status=e.status
            )


class PlaidTokenExchangeView(CreateAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = ExchangePlaidTokenSerializer


class PlaidItemsListView(ListAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = PlaidItemsSerializer

    def get_queryset(self):
        return PlaidItem.objects.filter(user=self.request.user).all()


class PlaidItemView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber, IsObjectOwner]
    serializer_class = PlaidItemsSerializer

    def get_object(self):
        obj = get_object_or_404(PlaidItem, pk=self.kwargs['id'])
        self.check_object_permissions(self.request, obj)
        return obj

    @highest_aal_freshness
    def delete(self, request, *args, **kwargs):
        obj = self.get_object()

        try:
            request = ItemRemoveRequest(access_token=obj.access_token)
            plaid_client.item_remove(request)
        except plaid.ApiException as e:
            return Response({'error': json.loads(e.body)}, status=e.status)
        else:
            self.perform_destroy(obj)
            return Response(status=HTTP_204_NO_CONTENT)
