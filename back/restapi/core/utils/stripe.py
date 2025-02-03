from rest_framework.status import (
    HTTP_503_SERVICE_UNAVAILABLE,
    HTTP_400_BAD_REQUEST
)
import stripe


class StripeError(Exception):  # Pragma: no cover
    def __init__(self, message, response_code):
        super().__init__(message)
        self.id = id
        self.message = message
        self.response_code = response_code

    def __str__(self):
        return f'{self.message} - {self.response_code}'


def stripe_error_handler(func):  # Pragma: no cover

    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except stripe.error.InvalidRequestError:
            raise StripeError(
                'Invalid request',
                HTTP_400_BAD_REQUEST
            )
        except stripe.error.APIConnectionError:
            raise StripeError(
                'Stripe API connection.',
                HTTP_503_SERVICE_UNAVAILABLE
            )
        except stripe.error.AuthenticationError:
            raise StripeError(
                'Stripe authentication.',
                HTTP_503_SERVICE_UNAVAILABLE
            )
        except stripe.error.APIError:
            raise StripeError(
                {'error': 'Stripe API.'},
                HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception:
            raise StripeError(
                {'error': 'Something went wrong with stripe.'},
                HTTP_503_SERVICE_UNAVAILABLE
            )

    return wrapper
