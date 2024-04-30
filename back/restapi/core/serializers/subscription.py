
import logging

from stripe import Subscription
from restapi.errors.validation import ValidationError500

ledget_logger = logging.getLogger('ledget')


class StripeSubscriptionSerializer:

    def __init__(self, sub: Subscription):
        self.sub = sub

    @property
    def data(self):
        try:
            return {
                'id': self.sub.id,
                'status': self.sub.status,
                'current_period_end': self.sub.current_period_end,
                'cancel_at_period_end': self.sub.cancel_at_period_end,
                'plan': {
                    'id': self.sub.plan.id,
                    'amount': self.sub.plan.amount,
                    'nickname': self.sub.plan.nickname,
                    'interval': self.sub.plan.interval,
                }
            }
        except AttributeError as e:
            ledget_logger.error(f'Error while serializing subscription: {e}')
            raise ValidationError500('Error while serializing subscription')
