import json
import os

from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import (
    LinkTokenCreateRequestUser
)
from plaid.model.products import Products
from plaid.api import plaid_api
import plaid
from django.http import JsonResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from core.models import PlaidItem


PLAID_CLIENT_ID = settings.PLAID_CLIENT_ID
PLAID_SECRET = settings.PLAID_API_KEY
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')
PLAID_REDIRECT_URI = settings.PLAID_REDIRECT_URI

if settings.PLAID_SANDBOX:
    plaid_host = plaid.Environment.Sandbox
elif settings.PLAID_DEVELOPMENT:
    plaid_host = plaid.Environment.Development
elif settings.PLAID_PRODUCTION:
    plaid_host = plaid.Environment.Production

configuration = plaid.Configuration(
    host=plaid_host,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
    }
)

plaid_products = []
for product in PLAID_PRODUCTS:
    plaid_products.append(Products(product))

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)


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
                    client_user_id=request.user.id
                )
            )
            # create link token
            response = client.link_token_create(request)
            return JsonResponse(data=response.to_dict(), status=200)
        except plaid.ApiException as e:
            return JsonResponse(
                data={'error': json.loads(e.body)},
                status=e.status
            )


class PlaidTokenExchangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        token = request.data.get('public_token', None)

        try:
            response = client.item_public_token_exchange(
                public_token=token
            )
            PlaidItem.objects.create(
                user=request.user,
                item_id=response.item_id,
                access_token=response.access_token
            )
            return JsonResponse(data=response.to_dict(), status=200)
        except plaid.ApiException as e:
            return JsonResponse(
                data={'error': json.loads(e.body)},
                status=e.status
            )
