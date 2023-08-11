from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import plaid

from core.permissions import IsUserOwner


PLAID_CLIENT_ID = settings.PLAID_CLIENT_ID
PLAID_SECRET = settings.PLAID_API_KEY

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


class TransactionsSyncView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsUserOwner]
