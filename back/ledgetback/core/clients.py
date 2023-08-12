import plaid
from plaid.api import plaid_api
from django.conf import settings

PLAID_SANDBOX = settings.PLAID_SANDBOX
PLAID_CLIENT_ID = settings.PLAID_CLIENT_ID
PLAID_API_KEY = settings.PLAID_API_KEY

if PLAID_SANDBOX:
    plaid_host = plaid.Environment.Sandbox
else:
    plaid_host = plaid.Environment.Development

plaid_config = plaid.Configuration(
    host=plaid_host,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_API_KEY,
    }
)

api_client = plaid.ApiClient(plaid_config)
plaid_client = plaid_api.PlaidApi(api_client)
