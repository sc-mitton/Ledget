import logging
import json

from celery import shared_task, group
import ory_client.exceptions
from plaid.model.item_remove_request import ItemRemoveRequest
from django.conf import settings
from django.db import OperationalError
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import transaction
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
            raise plaid.ApiException(e)


@shared_task(auto_retry_for=(ory_client.ApiException), retry_backoff=10,
             retry_jitter=True, retry_kwargs={'max_retries': 3})
def delete_ory_identity(user_id: str):

    with ory_client.ApiClient(ory_configuration) as api_client:
        api_instance = identity_api.IdentityApi(api_client)
        try:
            api_instance.delete_identity(user_id)
        except ory_client.exceptions.NotFoundException as e:
            logger.error(f"Ory user doesn't exist {user_id}: {e}")
        except ory_client.exceptions.ApiException as e:
            logger.error(f"Failed to delete ory user {user_id}: {e}")
            raise e


@shared_task(auto_retry_for=(OperationalError), retry_backoff=10, retry_jitter=True,
             retry_kwargs={'max_retries': 3})
def cancelation_cleanup(user_id: str) -> None:
    '''
    Deletes all third party data for a user. This is called when a user
    cancels their subscription and their billing cycle ends.
    '''
    from financials.models import PlaidItem

    @transaction.atomic
    def update_db(user, plaid_items):
        try:
            user.is_active = False
            user.account.canceled_on = timezone.now()
            user.save()
            plaid_items.delete()
        except Exception as e:
            logger.error(f'Failed to update db for user {user.id} on cancelation: {e}')

    try:
        user = get_user_model().objects.get(id=user_id)
    except get_user_model().DoesNotExist:
        return

    plaid_items = PlaidItem.objects.filter(
        user_id__in=[user.id, user.co_owner.id])
    delete_tasks = []
    for item in plaid_items:
        delete_task = delete_plaid_item.si(item.id, item.access_token)
        delete_tasks.append(delete_task)

    if delete_tasks:
        grouped_delete_tasks = group(delete_tasks)
        grouped_delete_tasks()

    update_db(user, plaid_items)
    delete_ory_identity.delay(user_id)


@shared_task(auto_retry_for=(OperationalError), retry_backoff=10, retry_jitter=True,
             retry_kwargs={'max_retries': 3})
def cleanup_hanging_ory_users(user_id: str) -> None:
    '''
    When a user is adding anonther user to their account, there's a possibility
    that the user might get added, but the linked user never finishes the process.
    We don't want to leave those users hanging for security purposes.
    '''

    with ory_client.ApiClient(ory_configuration) as api_client:
        api_instance = identity_api.IdentityApi(api_client)

        identity = None
        try:
            identity = api_instance.get_identity(user_id)
        except ory_client.exceptions.NotFoundException:
            pass

        # User is hanging
        try:
            if not identity or not identity['traits']['name']['first']:
                get_user_model().objects.filter(id=user_id).delete()
                api_instance.delete_identity(id=user_id)
        except ory_client.exceptions.ApiException as e:
            logger.error(f"Failed to delete hanging ory user {user_id}: {e}")
            pass
