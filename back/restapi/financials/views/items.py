import json

from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveDestroyAPIView
)
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_200_OK
from rest_framework.response import Response
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.item_remove_request import ItemRemoveRequest
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
import plaid

from restapi.permissions.auth import highest_aal_freshness, IsAuthenticated
from restapi.permissions.objects import HasObjectAccess, UserQueryParamIsSelf
from core.clients import create_plaid_client
from financials.serializers.items import (
    ExchangePlaidTokenSerializer,
    PlaidItemsSerializer,
)
from financials.models import PlaidItem

plaid_client = create_plaid_client()

PLAID_REDIRECT_URI_ONBOARDING = settings.PLAID_REDIRECT_URI_ONBOARDING
PLAID_REDIRECT_URI = settings.PLAID_REDIRECT_URI
PLAID_COUNTRY_CODES = settings.PLAID_COUNTRY_CODES
PLAID_WEBHOOK_ENDPOINT = settings.PLAID_WEBHOOK_ENDPOINT
DEVELOPMENT = settings.DEVELOPMENT

plaid_products, optional_plaid_products = [], []
for product in settings.PLAID_PRODUCTS:
    plaid_products.append(Products(product))
for product in settings.OPTIONAL_PLAID_PRODUCTS:
    optional_plaid_products.append(Products(product))


class PlaidLinkTokenView(APIView):
    permission_classes = [IsAuthenticated]

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
            'user': LinkTokenCreateRequestUser(
                client_user_id=str(request.user.id)
            ),
            'webhook': PLAID_WEBHOOK_ENDPOINT,
        }
        if kwargs.get('android_package', None):
            request_kwargs['android_package_name'] = kwargs['android_package']

        if not DEVELOPMENT:
            request_kwargs['redirect_uri'] = redirect_uri

        if kwargs.get('id', False):
            request_kwargs['access_token'] = \
                PlaidItem.objects.get(id=kwargs['id']).access_token
            request_kwargs['update'] = {"account_selection_enabled": True}
        else:
            request_kwargs['products'] = plaid_products
            request_kwargs['optional_products'] = optional_plaid_products

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
    permission_classes = [IsAuthenticated]
    serializer_class = ExchangePlaidTokenSerializer


class PlaidItemsListView(ListAPIView):
    permission_classes = [IsAuthenticated, UserQueryParamIsSelf]
    serializer_class = PlaidItemsSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user', None)
        if user_id:
            return PlaidItem.objects.filter(user_id=user_id)
        else:
            return PlaidItem.objects.filter(
                user__in=self.request.user.account.users.all())


class PlaidItemView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, HasObjectAccess]
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
        except plaid.ApiException as e:  # pragma: no cover
            return Response({'error': json.loads(e.body)}, status=e.status)

        try:
            obj.delete()
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        else:
            return Response(status=HTTP_204_NO_CONTENT)
