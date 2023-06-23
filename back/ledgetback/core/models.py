from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager
)
from django.core.validators import RegexValidator


class UserManager(BaseUserManager):

    def create_user(self, id, **extra_fields):
        """Create and save a new user."""
        if not id:
            raise ValueError('Users must have an id passed from ory.')

        user = self.model(id, **extra_fields)
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    ACCOUNT_FLAG_CHOICES = [
        ('service_abuse', 'Service abuse'),
    ]

    id = models.CharField(max_length=255, primary_key=True)
    account_flag = models.CharField(
        max_length=20,
        choices=ACCOUNT_FLAG_CHOICES,
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

    def __str__(self):
        return self.id

    @property
    def is_customer(self):
        return hasattr(self, 'customer')

    @property
    def subscription_status(self):
        if self.is_customer:
            return self.customer.subscription_status
        return None


class Customer(models.Model):
    # Learn more about the subscription statuses here:
    # https://stripe.com/docs/billing/subscriptions/overview#subscription-statuses
    TRIALING = 'trialing'
    ACTIVE = 'active'
    INCOMPLETE = 'incomplete'
    INCOMPLETE_EXPIRED = 'incomplete_expired'
    PAST_DUE = 'past_due'
    PAUSED = 'paused'
    UNPAID = 'unpaid'

    status_choices = [
        (TRIALING, 'Trialing'),
        (ACTIVE, 'Active'),
        (INCOMPLETE, 'Incomplete'),
        (INCOMPLETE_EXPIRED, 'Incomplete Expired'),
        (PAST_DUE, 'Past Due'),
        (PAUSED, 'Paused'),
        (UNPAID, 'Unpaid')
    ]
    # Canceled is not included as an option, when this happens,
    # the data is deleted in the db while stripe and other
    # services keep necessary data for analytics purposes

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id = models.CharField(max_length=255, blank=True, primary_key=True)
    subscription_status = models.CharField(
        choices=status_choices, max_length=20, null=True, default='incomplete')
    provisioned_until = models.IntegerField(default=0)
