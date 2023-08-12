import json
import os

from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.item_public_token_exchange_request import \
    ItemPublicTokenExchangeRequest
from plaid.model.link_token_create_request_user import (
    LinkTokenCreateRequestUser
)
from plaid.model.products import Products

import plaid
from rest_framework.response import Response
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR
)

from core.models import PlaidItem
from core.clients import plaid_client

PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')
PLAID_REDIRECT_URI = settings.PLAID_REDIRECT_URI

plaid_products = []
for product in PLAID_PRODUCTS:
    plaid_products.append(Products(product))


class PlaidLinkTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            request = LinkTokenCreateRequest(
                products=plaid_products,
                client_name='Ledget',
                country_codes=list(map(lambda x: CountryCode(x), ['US'])),
                language='en',
                user=LinkTokenCreateRequestUser(
                    client_user_id=str(request.user.id)
                )
            )
            request['redirect_uri'] = PLAID_REDIRECT_URI
            response = plaid_client.link_token_create(request)
            return Response(data=response.to_dict(), status=200)
        except plaid.ApiException as e:
            return Response(
                {'error': json.loads(e.body)},
                status=e.status
            )


class PlaidTokenExchangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        public_token = request.data.get('public_token', None)
        if not public_token:
            return Response(
                {'error': 'Missing public_token in request body'},
                status=HTTP_400_BAD_REQUEST
            )

        try:
            exchange_request = ItemPublicTokenExchangeRequest(
                public_token=public_token
            )
            response = plaid_client.item_public_token_exchange(
                exchange_request
            )
            PlaidItem.objects.create(
                user=request.user,
                id=response['item_id'],
                access_token=response['access_token']
            )
            return Response(data=response.to_dict(), status=200)
        except plaid.ApiException as e:
            return Response(
                {'error': json.loads(e.body)},
                status=HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
