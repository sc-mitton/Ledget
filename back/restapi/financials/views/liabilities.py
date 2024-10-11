from rest_framework import viewsets
from rest_framework.response import Response
from plaid.model.liabilities_get_request import LiabilitiesGetRequest
import plaid
import json

from financials.serializers.liabilities import LiabilitiesSerializer
from financials.models import PlaidItem
from core.clients import create_plaid_client

plaid_client = create_plaid_client()


class LiabilitiesViewSet(viewsets.ViewSet):
    serializer_classe = LiabilitiesSerializer

    def list(self, request):

        plaid_items = PlaidItem.objects.filter(
            user__in=request.user.account.users.all()) \
            .prefetch_related('accounts')

        data = {'student': [], 'mortgage': []}
        for p in plaid_items:
            plaid_data = self._get_plaid_data(p)
            data['student'].extend(plaid_data['student'])
            data['mortgage'].extend(plaid_data['mortgage'])

        serializer = LiabilitiesSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)

    def _get_plaid_data(self, plaid_item):
        try:
            request = LiabilitiesGetRequest(
                access_token=plaid_item.access_token)
            response = plaid_client.liabilities_get(request)
            return response.liabilities.to_dict()
        except plaid.ApiException as e:
            if json.loads(e.body).get('error_code') == 'PRODUCTS_NOT_SUPPORTED':
                return {
                    'student': [
                        {'account_id': a.id, 'product_not_supported': True}
                        for a in plaid_item.accounts.all() if a.subtype == 'student'
                    ],
                    'mortgage': [
                        {'account_id': a.id, 'product_not_supported': True}
                        for a in plaid_item.accounts.all() if a.subtype == 'mortgage'
                    ]
                }
