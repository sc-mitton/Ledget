import logging
import json

from celery import shared_task, group
from plaid.model.item_remove_request import ItemRemoveRequest
from django.conf import settings
import plaid
from core.clients import create_plaid_client
import ory_client
from ory_client.api import identity_api

logger = logging.getLogger('ledget')

plaid_client = create_plaid_client()

ory_configuration = ory_client.Configuration(
    host=settings.ORY_HOST,
    access_token=settings.ORY_API_KEY
)


@shared_task(auto_retry_for=(plaid.ApiException,), retry_backoff=10, retry_jitter=True,
             retry_kwargs={'max_retries': 3})
def delete_plaid_item(item_id: str, access_token: str):
    try:
        request = ItemRemoveRequest(access_token=access_token)
        plaid_client.item_remove(request)
    except plaid.ApiException as e:
        response = json.loads(e.body)
        if not response['error_code'] == 'ITEM_NOT_FOUND':
            logger.error(f'Failed to delete plaid item {item_id}: {e}')
            raise plaid.ApiException(e.status, e.reason, e.body)


@shared_task(auto_retry_for=(ory_client.ApiException,), retry_backoff=10,
             retry_jitter=True, retry_kwargs={'max_retries': 3})
def delete_ory_identity(user_id: str):

    with ory_client.ApiClient(ory_configuration) as api_client:
        api_instance = identity_api.IdentityApi(api_client)
        api_instance.delete_identity(user_id)


@shared_task
def cleanup(user_id: str) -> None:
    '''
    Deletes all third party data for a user. This is called when a user
    cancels their subscription and their billing cycle ends.
    '''

    from financials.models import PlaidItem
    plaid_items = PlaidItem.objects.filter(user_id=user_id)

    delete_tasks = []
    for item in plaid_items:
        delete_task = delete_plaid_item.si(item.id, item.access_token)
        delete_tasks.append(delete_task)

    if delete_tasks:
        grouped_delete_tasks = group(delete_tasks)
        grouped_delete_tasks()

    delete_ory_identity.delay(user_id)
