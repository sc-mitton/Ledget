from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager
)

import uuid


class UserManager(BaseUserManager):

    def create_user(self, email, password, **extra_fields):
        """Create and save a new user."""
        if not email:
            raise ValueError('Users must have an email address.')

        user = self.model(
            email=self.normalize_email(email),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, **extra_fields):
        """Create, save, and return a new superuser."""
        user = self.create_user(email, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    ACCOUNT_FLAG_CHOICES = [
        ('service_abuse', 'Service abuse'),
    ]

    email = models.EmailField(max_length=255, unique=True, blank=False)
    is_staff = models.BooleanField(default=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    account_flag = models.CharField(
        max_length=20,
        choices=ACCOUNT_FLAG_CHOICES,
        default=None,
        null=True,
    )

    objects = UserManager()
    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        if hasattr(self, 'customer'):
            return self.customer.full_name

    @property
    def is_customer(self):
        return hasattr(self, 'customer')

    @property
    def has_default_payment_method(self):
        customer = getattr(self, 'customer', None)
        subscription = getattr(customer, 'subscription', None)
        return bool(getattr(subscription, 'default_payment_method', None))

    @property
    def subscription_status(self):
        customer = getattr(self, 'customer', None)
        if customer:
            return customer.subscription.status \
                    if customer.subscription else None
        else:
            return None

# Stripe Models #
# The models related to stripe objects typically shouldn't
# modified directly, only through the stripe webhook view
# in response to stripe events.


class Customer(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='customer'
    )
    id = models.CharField(primary_key=True, max_length=50, editable=False)
    created = models.IntegerField(null=False, editable=False)

    # Billing info
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=30, null=True, blank=True)
    state = models.CharField(max_length=20, null=True, blank=True)
    postal_code = models.CharField(max_length=10, null=True, blank=True)
    country = models.CharField(max_length=20, null=True, blank=True)

    service_expiration = models.IntegerField(default=0, null=False)

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f'{self.first_name} {self.last_name}'
        else:
            return ''

    @property
    def billing_info(self):
        return {
            'name': self.full_name,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'country': self.country,
            'default_payment_method': self.default_payment_method,
        }

    @property
    def subscription(self):
        return self.subscriptions.exclude(
                status__in=['canceled', 'incomplete_expired']
                ).first()


class Price(models.Model):
    id = models.CharField(primary_key=True, max_length=70, editable=False)
    unit_amount = models.IntegerField()
    currency = models.CharField(max_length=10)
    active = models.BooleanField(default=True)
    created = models.IntegerField(editable=False)
    livemode = models.BooleanField(default=False)  # useful for testing
    lookup_key = models.CharField(max_length=30, blank=True)

    # metadata fields
    description = models.CharField(max_length=255, blank=True)
    contract_length = models.IntegerField(default=0)
    trial_period_days = models.IntegerField(default=0)
    renews = models.CharField(max_length=20, default='monthly')

    def __str__(self):
        return self.id


class SubscriptionManager(models.Manager):

    def create(self, *args, **kwargs):
        """Make sure that a user can only have one ongoing subscription
        at a time. A customer may have multiple canceled subscriptions."""
        customer = kwargs.get('customer')
        subscription = self.filter(customer=customer) \
                           .exclude(status__in=['canceled'])

        if subscription.exists():
            raise ValidationError(
                "User can only have one ongoing subscription at a time."
            )

        return super().create(*args, **kwargs)


class Subscription(models.Model):
    """Read more about the status choices here:
    https://stripe.com/docs/billing/subscriptions/overview#subscription-statuses""" # noqa

    status_choices = [
        ('trialing', 'trialing'),
        ('active', 'active'),
        ('incomplete', 'incomplete'),
        ('incomplete_expired', 'incomplete_expired'),
        ('past_due', 'past_due'),
        ('unpaid', 'unpaid'),
        ('canceled', 'canceled'),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )
    price = models.OneToOneField(
        Price,
        on_delete=models.PROTECT
    )

    id = models.CharField(max_length=70, primary_key=True, editable=False)
    created = models.IntegerField(editable=False)
    status = models.CharField(max_length=20, choices=status_choices)
    client_secret = models.CharField(max_length=100, null=True)

    current_period_end = models.IntegerField(null=True)
    cancel_at_period_end = models.BooleanField(default=False)
    default_payment_method = models.CharField(max_length=100, null=True)
    trial_start = models.IntegerField(editable=False)
    trial_end = models.IntegerField(null=True)

    objects = SubscriptionManager()

    def __str__(self):
        return self.id
