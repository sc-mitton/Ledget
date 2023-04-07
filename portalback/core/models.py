from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager
)
import uuid


class UserManager(BaseUserManager):

    def create_user(self, email, password, first_name='',
                    last_name='', **extra_fields):
        """Create and save a new user."""
        if not email:
            raise ValueError('Users must have an email address.')

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, first_name,
                         last_name, **extra_fields):
        """Create, save, and return a new superuser."""
        user = self.create_user(email, password, first_name,
                                last_name, **extra_fields)
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
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

    @classmethod
    def create(cls, **kwargs):
        billing_info_data = kwargs.pop('billinginfo', None)
        user = cls.objects.create(**kwargs)
        if billing_info_data:
            BillingInfo.objects.create(
                user=user, **billing_info_data
            )
        return user

    @property
    def full_name(self):
        if self.first_name and self.last_name:
            full_name = f'{self.first_name} {self.last_name}'
        else:
            full_name = ''
        return full_name.strip()


class BillingInfo(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='billing_info',
    )
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=20, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return f"{self.city}, {self.state} {self.postal_code}"


class Customer(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='customer'
    )
    customer_id = models.CharField(
        primary_key=True,
        max_length=255,
        unique=True
    )
    is_active = models.BooleanField(default=False)
    signup_date = models.DateTimeField(auto_now_add=True)
    trial_end = models.DateTimeField(null=True)
    subscription_id = models.CharField(max_length=255)

    def __str__(self):
        return self.user.email
