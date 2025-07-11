from django.db import models
import uuid
from django.utils.translation import gettext_lazy as _

from core.models import User
from budget.models import (
    Category,
    Bill,
    TransactionCategory
)
from restapi.models.base import BasePrivateModel, BaseSharedModel


class Institution(models.Model):

    id = models.CharField(max_length=100,
                          null=False,
                          blank=False,
                          primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, null=False, blank=False)
    logo = models.TextField(null=True, blank=True)
    primary_color = models.CharField(max_length=100, null=True, blank=True)
    url = models.CharField(max_length=100, null=True, blank=True)
    oath = models.CharField(max_length=100, null=True, default=False)


class PlaidItem(BasePrivateModel):
    class Meta:
        db_table = 'financials_plaid_item'

    institution = models.ForeignKey(
        Institution,
        on_delete=models.SET_NULL,
        null=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    id = models.CharField(max_length=40, primary_key=True, editable=False)
    access_token = models.CharField(max_length=100, null=True)
    cursor = models.CharField(max_length=256, null=True, blank=True)
    login_required = models.BooleanField(default=False)
    new_accounts_available = models.BooleanField(default=False)
    permission_revoked = models.BooleanField(default=False)
    pending_expiration = models.BooleanField(default=False)
    last_synced = models.DateTimeField(null=True, blank=True)

    # Assume true until proven otherwise
    investments_supported = models.BooleanField(default=True)
    liabilities_supported = models.BooleanField(default=True)


class Account(BasePrivateModel):

    users = models.ManyToManyField(User, through='UserAccount',
                                   related_name='accounts')
    plaid_item = models.ForeignKey(PlaidItem, on_delete=models.CASCADE,
                                   null=True, related_name='accounts')
    institution = models.ForeignKey(Institution,
                                    on_delete=models.SET_NULL,
                                    null=True,
                                    blank=True,
                                    related_name='accounts')
    id = models.CharField(max_length=100,
                          null=False,
                          blank=False,
                          primary_key=True)
    name = models.CharField(max_length=100, null=False, blank=False)
    mask = models.CharField(max_length=10, null=False, blank=False)
    subtype = models.CharField(max_length=50, null=True, blank=True)
    type = models.CharField(max_length=50, null=False, blank=False)
    verification_status = models.CharField(max_length=50, null=True,
                                           blank=True)


class AccountBalance(models.Model):
    value = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    date = models.DateField(null=False)
    account = models.ForeignKey(Account, on_delete=models.CASCADE,
                                related_name='balances')


class UserAccount(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    order = models.PositiveIntegerField(default=0)
    card_hue = models.CharField(max_length=10, null=True, blank=True)
    pinned = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'financials_user_account'
        ordering = ('order',)
        unique_together = ('account', 'user')


class Transaction(BaseSharedModel):
    '''
    Having a blank category or bill field is considered misc. category
    '''

    class Detail(models.IntegerChoices):
        INCOME = 0, _('income')
        INVESTMENT_TRANSFER_OUT = 1, _('investment_transfer_out')
        SPENDING = 2, _('spending')

    class Meta:
        get_latest_by = ['date', 'datetime']
        ordering = ['-date', '-datetime']

    # ID info
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    transaction_id = models.CharField(
        max_length=100, primary_key=True, editable=False)
    transaction_code = models.CharField(max_length=100, null=True, blank=True)
    transaction_type = models.CharField(max_length=100, null=True, blank=True)

    # Budget Info
    categories = models.ManyToManyField(
        Category,
        blank=True,
        related_name='categories',
        through=TransactionCategory)
    bill = models.ForeignKey(
        Bill,
        on_delete=models.SET_NULL,
        related_name='transactions',
        null=True,
        blank=True)
    predicted_category = models.ForeignKey(Category,
                                           on_delete=models.SET_NULL,
                                           null=True,
                                           blank=True,
                                           related_name='predicted_category')
    predicted_bill = models.ForeignKey(Bill,
                                       on_delete=models.SET_NULL,
                                       null=True,
                                       blank=True,
                                       related_name='predicted_bill')
    detail = models.IntegerField(choices=Detail.choices, null=True, blank=True)

    # Transaction info
    name = models.CharField(max_length=100, null=False, blank=False)
    preferred_name = models.CharField(max_length=100, null=True, blank=True)
    merchant_name = models.CharField(max_length=100, null=True, blank=True)
    payment_channel = models.CharField(max_length=100, null=True, blank=True)
    pending = models.BooleanField(null=True, blank=True)
    pending_transaction_id = models.CharField(max_length=100, null=True,
                                              blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=False,
                                 blank=False)
    iso_currency_code = models.CharField(max_length=3, null=True, blank=True)
    unnoficial_currency_code = models.CharField(max_length=10, null=True,
                                                blank=True)
    check_number = models.CharField(max_length=10, null=True, blank=True)

    # date info
    date = models.DateField(null=False, blank=False)
    datetime = models.DateTimeField(null=True, blank=True)
    authorized_date = models.DateField(null=True, blank=True)
    authorized_datetime = models.DateTimeField(null=True, blank=True)
    confirmed_date = models.DateField(null=True, blank=True)
    confirmed_datetime = models.DateTimeField(null=True, blank=True)

    # location info
    address = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    region = models.CharField(max_length=5, null=True, blank=True)
    postal_code = models.CharField(max_length=10, null=True, blank=True)
    country = models.CharField(max_length=50, null=True, blank=True)
    lat = models.FloatField(null=True, blank=True)
    lon = models.FloatField(null=True, blank=True)
    store_number = models.CharField(max_length=50, null=True, blank=True)


class Note(models.Model):

    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name='notes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    text = models.TextField(null=False, blank=False)
    datetime = models.DateTimeField(null=False, blank=False, auto_now_add=True)
