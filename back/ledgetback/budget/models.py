from django.db import models
import uuid
from django.utils.translation import gettext_lazy as _

from core.models import User


class BudgetCategory(models.Model):

    class CategoryType(models.TextChoices):
        YEAR = 'year', _('Year')
        MONTH = 'month', _('Month')

    class Meta:
        db_table = 'budget_category'
        verbose_name_plural = 'Budget Categories'

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=255, null=False, blank=False)
    emoji = models.CharField(max_length=10, null=False, blank=False)
    type = models.CharField(
        max_length=255,
        choices=CategoryType.choices,
        default=CategoryType.MONTH
    )
    limit = models.IntegerField(null=False, blank=False)


class Alert (models.Model):

    class Meta:
        db_table = 'alert'

    category = models.ForeignKey(BudgetCategory, on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    percent_amount = models.IntegerField(null=False, blank=False)
