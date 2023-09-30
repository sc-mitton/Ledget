
import logging
import http
from collections import deque
import time

import ory_client
from rest_framework.generics import RetrieveUpdateAPIView
from financials.models import PlaidItem
from plaid.model.item_remove_request import ItemRemoveRequest
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.conf import settings

from core.serializers import UserSerializer
from core.permissions import IsAuthenticated
from core.models import User
from core.clients import plaid_client

ory_configuration = ory_client.Configuration(
    access_token=settings.ORY_API_KEY,
)

logger = logging.getLogger('ledget')


class UserView(RetrieveUpdateAPIView):
    """Get me endpoint, returns user data and subscription data"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


@receiver(pre_delete, sender=User)
def cleanup(user_id: str):
    '''
    Handles cleaning up all third party user data
    '''

    def _delete_all_plaid_items():
        plaid_items = PlaidItem.objects.filter(user_id=user_id)
        delete_que = deque()
        for item in plaid_items:
            delete_que.append({
                'id': item.plaid_item_id,
                'access_token': item.access_token,
                'attemps': 0
            })

        while len(delete_que) > 0 or all(item['attemps'] >= 3 for item in delete_que):
            item_to_delete = delete_que.popleft()
            if item_to_delete['attemps'] >= 1:
                time.sleep(10 * item_to_delete['attemps'])

            try:
                request = ItemRemoveRequest(
                    access_token=item_to_delete['access_token']
                )
                plaid_client.item_remove(request)
            except Exception as e:
                logger.error(
                    f'Failed to delete plaid item {item_to_delete["id"]}: {e}'
                )
                item_to_delete['attemps'] += 1
                delete_que.append(item_to_delete)

        if len(delete_que) > 0:
            logger.error(f'Failed to delete all plaid items, {len(delete_que)} left')

    def _delete_ory_identity():

        with ory_client.ApiClient(ory_configuration) as api_client:
            api_instance = ory_client.AdminApi(api_client)

            for i in range(0, 3):
                try:
                    time.sleep(i * 10)
                    api_instance.delete_identity(user_id)
                except ory_client.ApiException as e:
                    # Identity doesn't exist, no need to delete
                    if e.status == http.HTTPStatus.NOT_FOUND:
                        break
                    # Final attempt, log error
                    elif i == 2:
                        logger.error(f'Failed to delete ory identity: {e}')
                else:
                    break

    _delete_all_plaid_items()
    _delete_ory_identity()
