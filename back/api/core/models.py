from django.db import models
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
    def subscription_status(self):
        customer = getattr(self, 'customer', None)
        if customer:
            return customer.subscription.status \
                    if customer.subscription else None
        else:
            return None
