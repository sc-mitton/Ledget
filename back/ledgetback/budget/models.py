from django.db import models
import uuid
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

from core.models import User


def validate_week_number(value):
    return value in [1, 2, 3, 4, -1] or ValidationError('Invalid week number')


class BudgetItem(models.Model):

    class Meta:
        abstract = True

    class CategoryType(models.TextChoices):
        YEAR = 'year', _('Year')
        MONTH = 'month', _('Month')

    type = models.CharField(
        max_length=255,
        choices=CategoryType.choices,
        default=CategoryType.MONTH
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=False, blank=False)
    emoji = models.CharField(max_length=10, null=False, blank=False)


class BudgetCategory(BudgetItem):

    class Meta:
        db_table = 'budget_category'
        verbose_name_plural = 'Budget Categories'

    limit_amount = models.IntegerField(null=False, blank=False)


class Bill(BudgetItem):

    lower_amount = models.IntegerField(null=True, blank=True)
    upper_amount = models.IntegerField(null=False, blank=False)
    day_of_month = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1, message="Day must be between 1 and 31."),
            MaxValueValidator(31, message="Day must be between 1 and 31."),
        ]
    )
    day_of_week = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(0, message="Day must be between 0 and 6."),
            MaxValueValidator(6, message="Day must be between 0 and 6."),
        ]
    )
    week_number = models.IntegerField(
        null=True,
        blank=True,
        validators=[validate_week_number]
    )
    month_number = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1, message="Day must be between 1 and 12."),
            MaxValueValidator(12, message="Day must be between 1 and 12."),
        ]
    )


class Alert (models.Model):

    class Meta:
        db_table = 'budget_alert'

    category = models.ForeignKey(BudgetCategory,
                                 on_delete=models.CASCADE,
                                 related_name='alerts')
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    percent_amount = models.IntegerField(null=False, blank=False)
