from django.db import models
from django.core.validators import RegexValidator


class UserManager(models.Manager):

    def create_user(self, id, password=None, **extra_fields):
        """Create and save a new user."""

        user = self.model(id, **extra_fields)
        user.save(using=self._db)

        return user


class User(models.Model):

    id = models.UUIDField(
        primary_key=True,
        editable=False
    )
    is_active = models.BooleanField(default=True)
    account_flag = models.CharField(
        max_length=20,
        choices=[('service_abuse', 'Service abuse')],
        default=None,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9-]{15,}+$',
                message='Field must contain only letters and numbers.',
            ),
        ],
    )

    objects = UserManager()
    USERNAME_FIELD = 'id'
    REQUIRED_FIELDS = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._traits = None

    @property
    def is_customer(self):
        return hasattr(self, 'customer')

    @property
    def subscription_status(self):
        if self.is_customer:
            return self.customer.subscription_status
        return None

    @property
    def traits(self):
        return self._traits

    @traits.setter
    def traits(self, value: dict):
        self._traits = value

    @property
    def is_authenticated(self):
        """
        Always return True. This is a way to tell if the user has been
        authenticated in templates.
        """
        return True

    @property
    def is_anonymous(self):
        """
        Always return False. This is a way of comparing User objects to
        anonymous users.
        """
        return False


class Customer(models.Model):
    """
    Learn more about the subscription statuses here:
    https://stripe.com/docs/billing/subscriptions/overview#subscription-statuses

    INCOMPLETE_EXPIRED is unused because it exists in stripe only to
    track customers who failed to activate their subscription

    UNPAID is unused because it is a status that can be triggered after unpaid

    CANCELED is not included as an status option, when this happens,
    the data is deleted in the db while stripe and other services keep
    necessary data for analytics purposes
    """

    TRIALING = 'trialing'
    ACTIVE = 'active'
    PAST_DUE = 'past_due'
    PAUSED = 'paused'
    INCOMPLETE = 'incomplete'

    status_choices = [
        (TRIALING, 'Trialing'),
        (ACTIVE, 'Active'),
        (INCOMPLETE, 'Incomplete'),
        (PAST_DUE, 'Past Due'),
        (PAUSED, 'Paused'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id = models.CharField(max_length=40, primary_key=True, editable=False)
    subscription_status = models.CharField(
        choices=status_choices, max_length=20, null=True, default='incomplete')
    provisioned_until = models.IntegerField(default=0)
