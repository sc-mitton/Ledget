import json
import os

from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import (
    LinkTokenCreateRequestUser
)
from plaid.model.products import Products

import plaid
from rest_framework.response import Response
from django.conf import settings
from rest_framework.views import APIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (HTTP_200_OK)

from core.clients import plaid_client
from core.serializers import ExchangePlaidTokenSerializer

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
            return Response(data=response.to_dict(),
                            status=HTTP_200_OK)
        except plaid.ApiException as e:
            return Response(
                {'error': json.loads(e.body)},
                status=e.status
            )


class PlaidTokenExchangeView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = [ExchangePlaidTokenSerializer]
