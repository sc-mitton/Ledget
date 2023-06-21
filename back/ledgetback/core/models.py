from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager
)

import uuid


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

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    account_flag = models.CharField(
        max_length=20,
        choices=ACCOUNT_FLAG_CHOICES,
        default=None,
        null=True,
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
    status_choices = [
        ('payment_failed', 'payment_failed'),
        ('active', 'active'),
        ('paused', 'paused'),
    ]
    # Canceled is not an option, when this happens, the data is
    # deleted in the db while stripe and other services keep
    # necessary data for analytics purposes

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id = models.CharField(max_length=255, blank=True, primary_key=True)
    subscription_status = models.CharField(
        choices=status_choices, max_length=20)
    provisioned_until = models.IntegerField(default=0)
