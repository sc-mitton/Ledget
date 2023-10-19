from django.db import models

from core.models import User
from budget.models import (
    Category,
    Bill
)


class Institution(models.Model):

    id = models.CharField(max_length=100,
                          null=False,
                          blank=False,
                          primary_key=True)
    name = models.CharField(max_length=100, null=False, blank=False)
    logo = models.ImageField(upload_to='logos', null=True, blank=True)
    primary_color = models.CharField(max_length=100, null=True, blank=True)
    url = models.CharField(max_length=100, null=True, blank=True)
    oath = models.CharField(max_length=100, null=True, default=False)


class PlaidItem(models.Model):
    class Meta:
        db_table = 'financials_plaid_item'

    institution = models.ForeignKey(
            Institution,
            on_delete=models.SET_NULL,
            null=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id = models.CharField(max_length=40, primary_key=True, editable=False)
    access_token = models.CharField(max_length=100, null=True)
    cursor = models.CharField(max_length=256, null=True, blank=True)
    login_required = models.BooleanField(default=False)
    new_accounts_available = models.BooleanField(default=False)
    permission_revoked = models.BooleanField(default=False)


class UserAccount(models.Model):
    account = models.ForeignKey('Account', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'financials_user_account'
        ordering = ('order',)
        unique_together = ('account', 'user')


class Account(models.Model):

    users = models.ManyToManyField(User, through=UserAccount,
                                   related_name='accounts')
    plaid_item = models.ForeignKey(PlaidItem,
                                   on_delete=models.CASCADE,
                                   related_name='accounts')
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


class Transaction(models.Model):
    '''
    Having a blank category or bill field is considered misc. category
    '''

    ignored_plaid_fields = [
            'account_owner',
            'category',
            'category_id',
            'check_number',
            'payment_meta',
            'personal_finance_category',
            'unofficial_currency_code',
        ]

    nested_plaid_fields = [
        'location'
    ]

    class Meta:
        get_latest_by = ['date', 'datetime']
        ordering = ['-date', '-datetime']

    # ID info
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100, primary_key=True, editable=False)
    transaction_code = models.CharField(max_length=100, null=True, blank=True)
    transaction_type = models.CharField(max_length=100, null=True, blank=True)

    # Budget Info
    category = models.ForeignKey(Category, on_delete=models.SET_NULL,
                                 null=True, blank=True)
    bill = models.ForeignKey(Bill, on_delete=models.SET_NULL,
                             null=True, blank=True)

    # Transaction info
    name = models.CharField(max_length=100, null=False, blank=False)
    merchant_name = models.CharField(max_length=100, null=True, blank=True)
    payment_channel = models.CharField(max_length=100, null=True, blank=True)
    pending = models.BooleanField(null=True, blank=True)
    pending_transaction_id = models.CharField(max_length=100, null=True,
                                              blank=True)
    amount = models.FloatField(null=False, blank=False)
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
