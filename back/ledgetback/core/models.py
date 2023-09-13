import uuid
from datetime import datetime

from django.db import models

from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _


class UserManager(models.Manager):

    def create_user(self, id, password=None, **extra_fields):
        """Create and save a new user."""

        user = self.model(id, **extra_fields)
        user.save(using=self._db)

        return user

    def create_superuser(self, id, password=None, **extra_fields):
        """Create and save a new superuser."""

        user = self.create_user(id, **extra_fields)
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(models.Model):

    id = models.UUIDField(primary_key=True, editable=False)
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
    is_onboarded = models.BooleanField(default=False)
    authenticator_enabled = models.BooleanField(default=False)
    authenticator_enabled_on = models.DateTimeField(null=True, default=None)

    objects = UserManager()
    USERNAME_FIELD = 'id'
    REQUIRED_FIELDS = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._traits = None
        self._is_verified = False
        self._devices = []
        self._authentication_level = None

    def save(self, *args, **kwargs):
        authenticator_enabled = kwargs.get('authenticator_enabled')
        if authenticator_enabled:
            self.authenticator_enabled_on = datetime.now()
        elif authenticator_enabled is not None:
            self.authenticator_enabled_on = None

        super().save(*args, **kwargs)

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
    def is_verified(self):
        return self._is_verified

    @is_verified.setter
    def is_verified(self, value: bool):
        self._is_verified = value

    @property
    def is_authenticated(self):
        """
        Always return True. This is a way to tell if the user has been
        authenticated in templates.
        """
        return True

    @property
    def devices(self):
        return self._devices

    @devices.setter
    def devices(self, value: list):
        self._devices = value

    @property
    def authentication_level(self):
        return self._authentication_level

    @authentication_level.setter
    def authentication_level(self, value):
        return self.authentication_level == value

    @property
    def is_anonymous(self):
        """
        Always return False. This is a way of comparing User objects to
        anonymous users.
        """
        return False

    @property
    def plaid_items(self):
        return self.plaiditem_set.all()

    @property
    def service_provisioned_until(self):
        '''Return the timestamp of when the service is provisioned until, i.e.
        the end of the current billing period plus 3 days for leniency.'''
        return int(self.customer.period_end) + (3 * 24 * 60 * 60)


class Customer(models.Model):
    """ See README for more information on the subscription statuses."""
    class SubscriptionStatus(models.TextChoices):
        INCOMPLETE = 'incomplete', _('Incomplete')
        INCOMPLETE_EXPIRED = 'incomplete_expired', _('Incomplete Expired')
        TRIALING = 'trialing', _('Trialing')
        ACTIVE = 'active', _('Active')
        PAST_DUE = 'past_due', _('Past Due')
        CANCELED = 'canceled', _('Canceled')
        PAUSED = 'paused', _('Paused')

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id = models.CharField(max_length=40, primary_key=True, editable=False)
    subscription_status = models.CharField(
        choices=SubscriptionStatus.choices,
        max_length=20,
        null=True,
        default=None
    )
    period_end = models.IntegerField(default=0)
    feedback = models.CharField(max_length=1000, null=True, default=None)
    cancelation_reason = models.CharField(max_length=1000,
                                          null=True, default=None)

    @property
    def has_current_subscription(self):
        return self.subscription_status in [
            self.SubscriptionStatus.ACTIVE,
            self.SubscriptionStatus.TRIALING,
        ]

    @property
    def subscription_not_canceled(self):
        return self.subscription_status != self.SubscriptionStatus.CANCELED


class Device(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_agent = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
