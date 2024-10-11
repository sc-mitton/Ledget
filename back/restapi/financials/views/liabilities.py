from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.db.models import Prefetch
from plaid.model.liabilities_get_request import LiabilitiesGetRequest
from plaid.model.liabilities_get_request_options import LiabilitiesGetRequestOptions
import plaid
import json

from financials.serializers.liabilities import LiabilitiesSerializer
from financials.models import PlaidItem, Account
from core.clients import create_plaid_client
from restapi.permissions.auth import IsAuthedVerifiedSubscriber

plaid_client = create_plaid_client()


class LiabilitiesView(GenericAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]

    def get(self, request):

        prefetch = Prefetch(
            'accounts',
            queryset=Account.objects.filter(
                subtype__in=['student', 'mortgage']))

        plaid_items = PlaidItem.objects.filter(
                user__in=request.user.account.users.all()).prefetch_related(prefetch)

        data = {'student': [], 'mortgage': []}
        for p in plaid_items:
            plaid_data = self._get_plaid_data(p)
            data['student'].extend(plaid_data.get('student', []))
            data['mortgage'].extend(plaid_data.get('mortgage', []))

        serializer = LiabilitiesSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)

    def _get_plaid_data(self, plaid_item):
        try:
            account_ids = [a.id for a in plaid_item.accounts.all()]
            request = LiabilitiesGetRequest(
                access_token=plaid_item.access_token,
                options=LiabilitiesGetRequestOptions(account_ids=account_ids))
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
