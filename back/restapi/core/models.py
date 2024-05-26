import uuid
from user_agents import parse
from user_agents.parsers import UserAgent

from django.db import models
from django.utils import timezone
from django.db.transaction import atomic
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AnonymousUser

import core.tasks as tasks


class Settings(models.Model):

    class MfaMethod(models.TextChoices):
        TOTP = 'totp', _('TOTP')

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    automatic_logout = models.BooleanField(default=False)
    mfa_method = models.CharField(
        choices=MfaMethod.choices, null=True, default=None, max_length=4
    )
    mfa_enabled_on = models.DateTimeField(null=True, default=None)

    def __setattr__(self, name, value):
        if name == "mfa_method":
            self.mfa_enabled_on = timezone.now() if value else None

        super().__setattr__(name, value)


class UserManager(models.Manager):

    def create_user(self, id, password=None, **extra_fields):
        """Create and save a new user."""

        return self._create(id, **extra_fields)

    @atomic
    def _create(self, id, **extra_fields):
        """Create and save a new user with settings."""

        user = self.model(id, **extra_fields)
        Settings.objects.create(user=user)
        user.save(using=self._db)

        return user

    def create_superuser(self, id, password=None, **extra_fields):  # pragma: no cover
        """Create and save a new superuser."""

        user = self.create_user(id, **extra_fields)
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(models.Model):

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    account = models.ForeignKey('Account', on_delete=models.CASCADE,
                                related_name='users', null=True, default=None)
    is_active = models.BooleanField(default=True)  # tombstone
    is_onboarded = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    password_last_changed = models.DateTimeField(null=True, default=None)
    created_on = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = 'id'
    REQUIRED_FIELDS = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._traits = None
        self._is_verified = False

    @property
    def traits(self):
        return self._traits

    @traits.setter
    def traits(self, value: dict):
        self._traits = value

    @property
    def co_owner(self):
        return next(
            (user for user in self.account.users.all() if user.id != self.id),
            AnonymousUser()
        )

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

    @property
    def highest_aal(self):
        if hasattr(self, 'settings'):
            return 'aal2' if self.settings.mfa_method == 'totp' else 'aal1'

    @property
    def is_account_owner(self):
        if hasattr(self.account, 'customer'):
            situation1 = self.account.customer.user.id == self.id
            situation2 = not situation1 and self.co_owner is None
            return situation1 or situation2
        return False


class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback = models.CharField(max_length=1000, null=True, default=None)
    cancelation_reason = models.CharField(max_length=1000, null=True, default=None)


class Account(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    yearly_anchor = models.DateTimeField(null=True, default=None)
    flag = models.CharField(
        max_length=20,
        choices=[('service_abuse', 'Service abuse')],
        default=None,
        null=True,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9-]{15,}+$",
                message='Field must contain only letters and numbers.',
            ),
        ],
    )

    customer = models.OneToOneField(
        'Customer', on_delete=models.CASCADE, null=True, default=None
    )
    created_on = models.DateTimeField(auto_now_add=True)
    canceled_on = models.DateTimeField(null=True, default=None)

    @property
    def service_provisioned_until(self):
        """Return the timestamp of when the service is provisioned until, i.e.
        the end of the current billing period plus 3 days for leniency."""
        if not hasattr(self, 'customer') or int(self.customer.period_end) == 0:
            return 0
        else:
            return int(self.customer.period_end) + (3 * 24 * 60 * 60)

    @property
    def has_customer(self):
        return self.customer is not None

    @property
    def subscription_status(self):
        if self.has_customer:
            return self.customer.subscription_status
        return None


class Customer(models.Model):
    """See README for more information on the subscription statuses."""

    class SubscriptionStatus(models.TextChoices):
        INCOMPLETE = 'incomplete', _('Incomplete')
        INCOMPLETE_EXPIRED = 'incomplete_expired', _('Incomplete Expired')
        TRIALING = 'trialing', _('Trialing')
        ACTIVE = 'active', _('Active')
        PAST_DUE = 'past_due', _('Past Due')
        CANCELED = 'canceled', _('Canceled')
        PAUSED = 'paused', _('Paused')
        DELETED = 'deleted', _('Deleted')

    id = models.CharField(max_length=40, primary_key=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    subscription_status = models.CharField(
        choices=SubscriptionStatus.choices,
        max_length=20,
        null=True,
        default=None
    )
    period_end = models.IntegerField(default=0)

    def delete(self, *args, **kwargs):
        """
        Customers are deleted after the end of the billing cycle and
        the stripe webhook is hit. When this happens, the third party
        data needs to be deleted. As much as possible is kept for analytics.
        Cleanup happens by kicking off a celery task.
        """
        tasks.cancelation_cleanup.delay(str(self.user_id))
        tasks.cancelation_cleanup.delay(str(self.user.co_owner.id))
        return super().delete(*args, **kwargs)

    @property
    def subscription_not_canceled(self):
        return self.subscription_status != self.SubscriptionStatus.CANCELED


class DeviceManager(models.Manager):

    def parse_ua_dict(self, ua: str):
        user_agent = parse(ua)

        kwargs = {}
        for field in Device._meta.get_fields():
            property = self.get_user_agent_property(field.name, user_agent)
            if property:
                kwargs[field.name] = property

        return kwargs

    def get_user_agent_property(self, field_name: str, parsed_ua: UserAgent):

        if field_name.startswith('is_'):
            return getattr(parsed_ua, field_name)

        if self._is_user_agent_field(field_name, parsed_ua):
            split_field_name = field_name.split('_')
            return getattr(
                getattr(parsed_ua, split_field_name[0]),
                split_field_name[1]
            )

        return None

    def _is_user_agent_field(self, field_name: str, parsed_ua: UserAgent):

        split_field_name = field_name.split('_')
        if hasattr(parsed_ua, split_field_name[0]):
            return hasattr(
                getattr(parsed_ua, split_field_name[0]),
                split_field_name[1]
            )

        return False


class Device(models.Model):
    class Aal(models.TextChoices):
        AAL1 = 'aal1', _('AAL1')
        AAL15 = 'aal15', _('AAL15')
        AAL2 = 'aal2', _('AAL2')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='device_set')
    token = models.CharField(max_length=100)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    location = models.CharField(max_length=100, editable=False)
    aal = models.CharField(choices=Aal.choices, max_length=7, default=Aal.AAL1)
    last_login = models.DateTimeField(auto_now=True)

    # Parsed data from user agent
    browser_family = models.CharField(max_length=20, null=True, default=None)
    browser_version = models.CharField(max_length=20, null=True, default=None)
    os_family = models.CharField(max_length=20, null=True, default=None)
    os_version = models.CharField(max_length=20, null=True, default=None)
    device_family = models.CharField(max_length=20, null=True, default=None)
    device_brand = models.CharField(max_length=20, null=True, default=None)
    device_model = models.CharField(max_length=20, null=True, default=None)
    is_mobile = models.BooleanField(default=False)
    is_pc = models.BooleanField(default=False)
    is_tablet = models.BooleanField(default=False)
    is_touch_capable = models.BooleanField(default=False)
    is_bot = models.BooleanField(default=False)

    objects = DeviceManager()

    def __setattr__(self, name: str, *args, **kwargs) -> None:
        if name == 'token':
            self.last_login = timezone.now()
        super().__setattr__(name, *args, **kwargs)
