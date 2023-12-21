from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.serializers import ListSerializer
from plaid.model.accounts_get_request import AccountsGetRequest
import plaid

from core.permissions import IsAuthedVerifiedSubscriber, IsObjectOwner
from core.clients import create_plaid_client
from core.models import User
from financials.models import Account, UserAccount
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
        if isinstance(self.request.data, list) \
                and len(self.request.data) > 0 \
                and 'order' in self.request.data[0]:
            return UserAccountSerializer
        return AccountSerializer

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self, serializer):
        if isinstance(serializer.child, UserAccountSerializer):
            return UserAccount.objects.filter(user_id=self.request.user.id)
        else:
            return User.objects.get(id=self.request.user.id).accounts.all()

    def get_object(self, request):
        account = Account.objects.get(id=self.request.query_params.get('id'))
        self.check_object_permissions(request, account)

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if isinstance(serializer, ListSerializer):
            to_update = self.get_queryset(serializer)
        else:
            to_update = self.get_object()

        serializer.update(to_update, serializer.validated_data)

        return Response(serializer.data)

    def get(self, request, *args, **kwargs):
        '''Get all the account data belonging to a specific user'''
        already_fetched_tokens = []
        accounts = Account.objects.filter(useraccount__user_id=self.request.user.id) \
                                  .order_by('useraccount__order') \
                                  .prefetch_related('plaid_item') \
                                  .prefetch_related('institution')

        account_balances = {account.id: None for account in accounts}
        try:
            for account in accounts:
                if account.plaid_item.access_token in already_fetched_tokens:
                    continue

                request = AccountsGetRequest(
                    access_token=account.plaid_item.access_token)

                response = plaid_client.accounts_get(request).to_dict()
                for a in response['accounts']:
                    account_balances[a['account_id']] = {
                        **a, 'institution_id': account.institution.id,
                    }
                already_fetched_tokens.append(account.plaid_item.access_token)

        except plaid.ApiException as e:
            return Response({'error': {'message': str(e)}}, e.status)

        institution_data = {
            account.institution.id: InstitutionSerializer(account.institution).data
            for account in accounts}

        return Response({
            'accounts': account_balances.values(),
            'institutions': institution_data.values(),
        }, HTTP_200_OK)
