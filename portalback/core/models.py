from django.db import models
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager
)
import stripe

import uuid


stripe.api_key = settings.STRIPE_SK


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

    email = models.EmailField(max_length=255, unique=True, blank=False)
    is_staff = models.BooleanField(default=True)
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
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
        else:
            return ''


class Customer(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='customer'
    )
    id = models.CharField(primary_key=True, max_length=50, editable=False)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)

    # Billing Info
    city = models.CharField(max_length=30, null=True, blank=True)
    state = models.CharField(max_length=20, null=True, blank=True)
    postal_code = models.CharField(max_length=10, null=True, blank=True)
    country = models.CharField(max_length=20, null=True, blank=True)
    delinquet = models.BooleanField(default=False)

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f'{self.first_name} {self.last_name}'
        else:
            return ''

    @classmethod
    def create(cls, **kwargs):
        stripe_customer = stripe.Customer.create(
            email=kwargs['user'].email,
            name=kwargs['first_name'] + ' ' + kwargs['last_name'],
            address={
                'city': kwargs['city'],
                'state': kwargs['state'],
                'postal_code': kwargs['postal_code'],
                'country': kwargs['country']
            }
        )
        cls.objects.create(
            customer_id=stripe_customer.customer_id,
            **kwargs
        )

    def save(self, update_stripe=False, *args, **kwargs):
        if update_stripe:
            self.update_stripe(*args, **kwargs)

        super().save(*args, **kwargs)

    def update_stripe(self, *args, **kwargs):

        stripe.Customer.modify(
                self.id,
                email=self.user.email,
                name=self.full_name,
                address={
                    'city': self.city,
                    'state': self.state,
                    'postal_code': self.postal_code,
                    'country': self.country
                }
            )


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

    def __str__(self):
        return self.id

    def save(self, update_stripe=False, *args, **kwargs):
        if update_stripe:
            self.update_stripe(*args, **kwargs)

        super().save(*args, **kwargs)

    def update_stripe(self, *args, **kwargs):

        meta_data_keys = ('description', 'contract_length',
                          'trial_period_days')
        for key in meta_data_keys:
            if key in kwargs:
                kwargs['metadata'][key] = kwargs.pop(key)

        stripe.Price.modify(
            self.id,
            *args,
            **kwargs
        )


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
    price = models.ForeignKey(Price, on_delete=models.PROTECT)
    current_period_end = models.IntegerField()
    status = models.CharField(max_length=20, choices=status_choices)
    cancel_at_period_end = models.BooleanField(default=False)
    default_payment_method = models.CharField(max_length=100, blank=True)
    created = models.IntegerField(editable=False)
    trial_start = models.IntegerField(editable=False, null=True)

    @classmethod
    def create(cls, customer, price, **kwargs):

        default_args = {
            'payment_behavior': 'default_incomplete',
            'payment_settings': {
                'save_default_payment_method': 'on_subscription'
            },
            'expand': ['pending_setup_intent'],
            'proration_behavior': 'none',
            # 'automatic_tax': {"enabled": True},
            # deactivated for now, reactivate in production
        }
        default_args.update(kwargs)

        stripe_subscription = stripe.Subscription.create(
            customer=customer.id,
            trial_period_days=price.trial_period_days,
            items=[{'price': price.id}],
            **default_args
        )

        cls.objects.create(
            id=stripe_subscription.id,
            customer=customer,
            price=price,
            status=stripe_subscription.status,
            created=stripe_subscription.created,
            trial_start=stripe_subscription.trial_start,
        )
        return stripe_subscription

    def save(self, update_stripe=False, *args, **kwargs):

        if update_stripe:
            self.update_stripe(*args, **kwargs)

        super().save(*args, **kwargs)

    def update_stripe(self, *args, **kwargs):

        subscription = stripe.Subscription.retrieve(self.id)

        if 'price' in kwargs:
            kwargs['items'] = [{
                'id': subscription['items']['data'][0].id,
                'price': kwargs.pop('price').id
            }]

        stripe.Subscription.modify(
            self.id,
            *args,
            **kwargs
        )

    def __str__(self):
        return self.id
