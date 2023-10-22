from django.db import models

from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

from core.models import User
from budget.base_models import Notification, BudgetItem


def validate_week_number(value):
    return value in [1, 2, 3, 4, -1] or ValidationError('Invalid week number')


class Category(BudgetItem):

    limit_amount = models.IntegerField(null=True, blank=True)


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


class Alert (Notification):

    class Meta:
        db_table = 'budget_alert'

    category = models.ForeignKey(Category,
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


class UserCategory(models.Model):

    class Meta:
        db_table = 'budget_user_category'
        unique_together = ('user', 'category')

    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name='user_categories')
    category = models.ForeignKey(Category,
                                 on_delete=models.CASCADE,
                                 related_name='user_categories')
    order = models.IntegerField(null=False, blank=False)


class UserBill(models.Model):

    class Meta:
        db_table = 'budget_user_bill'
        unique_together = ('user', 'bill')

    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name='user_bills')
    bill = models.ForeignKey(Bill,
                             on_delete=models.CASCADE,
                             related_name='user_bills')
    order = models.IntegerField(null=False, blank=False)
