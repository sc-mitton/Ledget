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
    """ See README for more information on the subscription statuses."""

    INCOMPLETE = 'incomplete'
    INCOMPLETE_EXPIRED = 'incomplete_expired'
    TRIALING = 'trialing'
    ACTIVE = 'active'
    PAST_DUE = 'past_due'
    CANCELED = 'canceled'

    status_choices = [
        (INCOMPLETE, 'Incomplete'),
        (INCOMPLETE_EXPIRED, 'Incomplete Expired'),
        (TRIALING, 'Trialing'),
        (ACTIVE, 'Active'),
        (PAST_DUE, 'Past Due'),
        (CANCELED, 'Canceled')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id = models.CharField(max_length=40, primary_key=True, editable=False)
    subscription_status = models.CharField(
        choices=status_choices, max_length=20, null=True, default='incomplete')
    provisioned_until = models.IntegerField(default=0)
