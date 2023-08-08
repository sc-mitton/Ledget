import time
import json


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


PLAID_CLIENT_ID = settings.PLAID_CLIENT_ID
PLAID_SECRET = settings.PLAID_API_KEY
PLAID_PRODUCTS = settings.PLAID_PRODUCTS
PLAID_REDIRECT_URI = settings.PLAID_REDIRECT_URI

configuration = plaid.Configuration(
    host=settings.DOMAIN,
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


class LinkView(APIView):

    def get(self, request, *args, **kwargs):
        try:
            request = LinkTokenCreateRequest(
                products=plaid_products,
                client_name=PLAID_CLIENT_ID,
                country_codes=list(map(lambda x: CountryCode(x), ['US'])),
                language='en',
                user=LinkTokenCreateRequestUser(
                    client_user_id=str(time.time())
                )
            )
            if PLAID_REDIRECT_URI is not None:
                request['redirect_uri'] = PLAID_REDIRECT_URI
            # create link token
            response = client.link_token_create(request)
            return JsonResponse(response.to_dict())
        except plaid.ApiException as e:
            return json.loads(e.body)
