import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

from core.models import User
from budget.base_models import Notification, BudgetItem


def validate_week_number(value):
    return value in [1, 2, 3, 4, -1] or ValidationError('Invalid week number')


class Category(BudgetItem):

    class CategoryType(models.TextChoices):
        YEAR = 'year', _('Yearly')
        MONTH = 'month', _('Monthly')

    period = models.CharField(
        max_length=255,
        choices=CategoryType.choices,
        default=CategoryType.MONTH
    )

    users = models.ManyToManyField(User,
                                   through='UserCategory',
                                   related_name='categories')
    limit_amount = models.IntegerField(null=True, blank=True, validators=[
        MinValueValidator(0, message="Limit must be greater than 0."),
    ])
    is_default = models.BooleanField(default=False)


class Bill(BudgetItem):

    class CategoryType(models.TextChoices):
        YEAR = 'year', _('Yearly')
        MONTH = 'month', _('Monthly')
        ONCE = 'once', _('Once')

    users = models.ManyToManyField(User,
                                   through='UserBill',
                                   related_name='bills')
    reminders = models.ManyToManyField('Reminder',
                                       related_name='bills',
                                       blank=True)
    period = models.CharField(
        max_length=255,
        choices=CategoryType.choices,
        default=CategoryType.MONTH
    )
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
    skipped = models.BooleanField(default=False)
    year = models.IntegerField(null=True, blank=True)

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

    class Period(models.TextChoices):
        DAY = 'day', _('Day')
        WEEK = 'week', _('Week')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    period = models.CharField(
        max_length=40,
        choices=Period.choices,
        default=Period.WEEK,
        blank=False,
        null=False
    )
    offset = models.IntegerField(null=False, blank=False)


class UserCategory(models.Model):

    class Meta:
        ordering = ('order',)
        db_table = 'budget_user_category'
        unique_together = ('user', 'category')

    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    primary_owner = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    order = models.IntegerField(null=False, default=0)

    def save(self, **kwargs):
        if not self.user.yearly_anchor and self.category.period == 'year':
            self.user.yearly_anchor = timezone.now()
            self.user.save()
        return super().save()


class TransactionCategory(models.Model):

    class Meta:
        db_table = 'budget_transaction_category'
        unique_together = ('transaction', 'category')

    transaction = models.ForeignKey('financials.Transaction',
                                    on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    fraction = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])


class UserBill(models.Model):

    class Meta:
        db_table = 'budget_user_bill'
        unique_together = ('user', 'bill')

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    primary_owner = models.BooleanField(default=True)

    def create(self):
        if not self.user.yearly_anchor and self.bill.period == 'year':
            self.user.yearly_anchor = timezone.now()
            self.user.save()
        return super().create()
