from celery import shared_task
import logging

from django.contrib.auth import get_user_model

logger = logging.getLogger('ledget')


@shared_task
def cleanup_stripe_webhook_tests(user_id):  # pragma: no cover
    '''
    Stripe webhook tests are run via a shell script and end up
    creating some objects in the db that need to be cleaned up
    afterwards.
    '''

    from core.models import Account  # avoid circular import

    logger.info(f'Cleaning up user {user_id} from sripe webhook tests...')

    try:
        account = Account.objects.get(user__id=user_id)
        user = get_user_model().objects.get(id=user_id)
        user.delete()
        account.delete()
    except (get_user_model().DoesNotExist, Account.DoesNotExist) as e:
        logger.error(f'Oject does not exist: {e}')
