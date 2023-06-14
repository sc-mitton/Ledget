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
    is_staff = models.BooleanField(default=True)
    account_flag = models.CharField(
        max_length=20,
        choices=ACCOUNT_FLAG_CHOICES,
        default=None,
        null=True,
    )

    objects = UserManager()
    USERNAME_FIELD = 'id'

    def __str__(self):
        return self.email

    @property
    def is_customer(self):
        return hasattr(self, 'customer')


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    subscription_status = models.CharField(max_length=255, blank=True)
    customer_id = models.CharField(max_length=255, blank=True)
