from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from plaid.model.accounts_get_request import AccountsGetRequest
import plaid

from core.permissions import IsAuthedVerifiedSubscriber, IsObjectOwner
from core.clients import create_plaid_client
from core.models import User
from financials.models import Account
from financials.serializers.account import (
    InstitutionSerializer,
    AccountSerializer,
    UserAccountSerializer
)

plaid_client = create_plaid_client()


class AccountsView(GenericAPIView):
    serializer_classes = [AccountSerializer, UserAccountSerializer]
    permission_classes = [IsAuthedVerifiedSubscriber, IsObjectOwner]

    def get_serializer_class(self):
        # If data is a list and 'order' is in the list items, use UserAccountSerializer
        if isinstance(self.request.data, list) and 'order' in self.request.data[0]:
            return UserAccountSerializer
        return AccountSerializer

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        return User.objects.get(id=self.request.user.id).accounts.all()

    def get_object(self, request):
        account = Account.objects.get(id=self.request.query_params.get('id'))
        self.check_object_permissions(request, account)

    def patch(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        return serializer.update(queryset, serializer.validated_data)

    def get(self, request, *args, **kwargs):
        '''Get all the account data belonging to a specific user'''
        already_fetched_tokens = []
        accounts = User.objects.get(id='5ccddb2e-55e3-4874-9724-991b145fe6a3') \
                               .accounts.all() \
                               .prefetch_related('plaid_item') \
                               .prefetch_related('institution')

        account_balance_data = []
        try:
            for account in accounts:
                if account.plaid_item.access_token in already_fetched_tokens:
                    continue

                request = AccountsGetRequest(
                    access_token=account.plaid_item.access_token)

                response = plaid_client.accounts_get(request).to_dict()
                for a in response['accounts']:
                    account_balance_data += [{
                        'institution_id': account.institution.id,
                        **a
                    }]
                already_fetched_tokens.append(account.plaid_item.access_token)

        except plaid.ApiException as e:
            return Response({'error': {'message': str(e)}}, e.status)

        institution_data = [
            InstitutionSerializer(account.institution).data
            for account in accounts
        ]

        return Response(
            {'accounts': account_balance_data, 'institutions': institution_data},
            HTTP_200_OK
        )
