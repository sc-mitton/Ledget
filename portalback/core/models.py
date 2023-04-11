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
        ('not_paid', 'Not paid'),
        ('payment_decline', 'Payment decline'),
        ('service_abuse', 'Service abuse'),
    ]

    email = models.EmailField(max_length=255, unique=True, blank=False)
    is_staff = models.BooleanField(default=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provision_service = models.BooleanField(default=False)
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

    @classmethod
    def create(cls, **kwargs):
        customer_data = kwargs.pop('customer', None)
        user = cls.objects.create(**kwargs)
        if customer_data:
            Customer.objects.create(
                user=user, **customer_data
            )
        return user

    @property
    def full_name(self):
        if hasattr(self, 'customer'):
            return self.customer.full_name


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
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)

    # Address
    city = models.CharField(max_length=30, null=True, blank=True)
    state = models.CharField(max_length=20, null=True, blank=True)
    postal_code = models.CharField(max_length=10, null=True, blank=True)
    country = models.CharField(max_length=20, null=True, blank=True)

    delinquent = models.BooleanField(default=False)
    default_payment_method = models.CharField(
        max_length=100, null=True, blank=True
    )
    created = models.IntegerField(null=False, editable=False)

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


class Price(models.Model):
    id = models.CharField(primary_key=True, max_length=70, editable=False)
    unit_amount = models.IntegerField()
    currency = models.CharField(max_length=10)
    active = models.BooleanField(default=True)
    created = models.IntegerField(editable=False)
    livemode = models.BooleanField(default=False)
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
    status_choices = [
        ('incomplete', 'incomplete'),
        ('incomplete_expired', 'incomplete_expired'),
        ('trialing', 'trialing'),
        ('active', 'active'),
        ('past_due', 'past_due'),
        ('canceled', 'canceled'),
        ('unpaid', 'unpaid')
    ]

    id = models.CharField(max_length=70, primary_key=True, editable=False)
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='subscription'
    )
    price = models.ForeignKey(
        Price,
        on_delete=models.PROTECT
    )
    current_period_end = models.IntegerField(null=True)
    status = models.CharField(max_length=20, choices=status_choices)
    cancel_at_period_end = models.BooleanField(default=False)
    default_payment_method = models.CharField(max_length=100, null=True)
    created = models.IntegerField(editable=False)
    trial_start = models.IntegerField(editable=False)
    trial_end = models.IntegerField(null=True)

    objects = SubscriptionManager()

    def __str__(self):
        return self.id
