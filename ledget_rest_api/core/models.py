from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth.models import (
    AbstractUser,
    PermissionsMixin,
    BaseUserManager
)
from rest_framework.authtoken.models import Token


class UserManager(BaseUserManager):

    def create_user(self, email, name, phone, password, **extra_fields):
        """Create and save a new user."""
        if not email:
            raise ValueError('Users must have an email address.')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            phone=phone,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, phone, password, **extra_fields):
        """Create, save, and return a new superuser."""
        user = self.create_user(email, name, phone, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractUser, PermissionsMixin):

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    def __str__(self):
        return self.email
