import http
import logging

from celery import shared_task, group
from plaid.model.item_remove_request import ItemRemoveRequest
from django.conf import settings

import ory_client
from core.clients import plaid_client

logger = logging.getLogger('ledget')
ory_configuration = ory_client.Configuration(
    access_token=settings.ORY_API_KEY,
)


@shared_task(auto_retry_for=(Exception,), retry_backoff=10, retry_jitter=True,
             retry_kwargs={'max_retries': 3})
def delete_plaid_item(item_id, access_token):
    try:
        request = ItemRemoveRequest(access_token=access_token)
        plaid_client.item_remove(request)
        return True
    except Exception as e:
        logger.error(f'Failed to delete plaid item {item_id}: {e}')
        return False


@shared_task(auto_retry_for=(Exception,), retry_backoff=10, retry_jitter=True,
             retry_kwargs={'max_retries': 3})
def delete_ory_identity(user_id):
    with ory_client.ApiClient(ory_configuration) as api_client:
        api_instance = ory_client.AdminApi(api_client)
        try:
            api_instance.delete_identity(user_id)
        except ory_client.ApiException as e:
            if e.status != http.HTTPStatus.NOT_FOUND:
                logger.error(f'Failed to delete ory identity: {e}')
            else:
                logger.info(f'No ory identity found for user {user_id}')


@shared_task
def cleanup(user_id):
    from financials.models import PlaidItem
    plaid_items = PlaidItem.objects.filter(user_id=user_id)

    delete_tasks = []
    for item in plaid_items:
        delete_task = delete_plaid_item.si(item.plaid_item_id, item.access_token)
        delete_tasks.append(delete_task)

    if delete_tasks:
        grouped_delete_tasks = group(delete_tasks)
        grouped_delete_tasks()

    delete_ory_identity.delay(user_id)


@shared_task
def test_add(x, y):
    return x + y
