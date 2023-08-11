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
    day = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1, message="Day must be between 1 and 31."),
            MaxValueValidator(31, message="Day must be between 1 and 31."),
        ]
    )
    week = models.IntegerField(
        null=True,
        blank=True,
        validators=[validate_week_number]
    )
    week_day = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(0, message="Day must be between 0 and 6."),
            MaxValueValidator(6, message="Day must be between 0 and 6."),
        ]
    )
    month = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1, message="Day must be between 1 and 12."),
            MaxValueValidator(12, message="Day must be between 1 and 12."),
        ]
    )

    def clean(self):

        super().clean()
        # Either day_of_month or both day_of_week and week_number must be set
        if not self.day_of_month and \
           not (self.day_of_week and self.week_number):
            raise ValidationError(
                'Either day_of_month or'
                ' both day_of_week and week_number must be set'
            )


class Notification(models.Model):

    class Meta:
        abstract = True

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)


class Alert (Notification):

    class Meta:
        db_table = 'budget_alert'

    category = models.ForeignKey(BudgetCategory,
                                 on_delete=models.CASCADE,
                                 related_name='alerts')
    percent_amount = models.IntegerField(null=False, blank=False)


class Reminder(Notification):

    class Meta:
        db_table = 'budget_reminder'

    class Perdiod(models.TextChoices):
        DAY = 'day', _('Day')
        WEEK = 'week', _('Week')

    bill = models.ForeignKey(Bill,
                             on_delete=models.CASCADE,
                             related_name='reminders')

    period = models.CharField(
        max_length=40,
        choices=Perdiod.choices,
        default=Perdiod.WEEK,
        blank=False,
        null=False
    )
    offset = models.IntegerField(null=False, blank=False)
