import uuid

from django.utils.translation import gettext_lazy as _
from django.db import models

from core.models import User


class BudgetItem(models.Model):

    class Meta:
        abstract = True

    class CategoryType(models.TextChoices):
        YEAR = 'year', _('Yearly')
        MONTH = 'month', _('Monthly')

    period = models.CharField(
        max_length=255,
        choices=CategoryType.choices,
        default=CategoryType.MONTH
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=False, blank=False)
    emoji = models.CharField(max_length=10, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)


class Notification(models.Model):

    class Meta:
        abstract = True

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
