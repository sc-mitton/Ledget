from django.db import models

# Create your models here.
from core.models import PlaidItem


class Account(models.Model):

    item = models.ForeignKey(PlaidItem,
                             on_delete=models.CASCADE,
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


class Transactions(models.Model):

    class Meta:
        db_table = 'transactions'

    # ID info
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100, primary_key=True)
    transaction_code = models.CharField(max_length=100, null=True, blank=True)
    transaction_type = models.CharField(max_length=100, null=True, blank=True)

    # Transaction info
    name = models.CharField(max_length=100, null=False, blank=False)
    merchant_name = models.CharField(max_length=100, null=True, blank=True)
    payment_channel = models.CharField(max_length=100, null=True, blank=True)
    pending = models.BooleanField(null=True, blank=True)
    pending_transaction_id = models.CharField(max_length=100, null=True,
                                              blank=True)
    amount = models.IntegerField(null=False, blank=False)
    iso_currency_code = models.CharField(max_length=3, null=True, blank=True)
    unnoficial_currency_code = models.CharField(max_length=10, null=True,
                                                blank=True)
    check_number = models.CharField(max_length=10, null=True, blank=True)

    # date info
    date = models.DateField(null=False, blank=False)
    datetime = models.DateTimeField(null=False, blank=False)
    authorized_date = models.DateField(null=True, blank=True)
    authorized_datetime = models.DateTimeField(null=True, blank=True)

    # location info
    address = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    region = models.CharField(max_length=2, null=True, blank=True)
    postal_code = models.CharField(max_length=10, null=True, blank=True)
    country = models.CharField(max_length=50, null=True, blank=True)
    lat = models.FloatField(null=True, blank=True)
    lon = models.FloatField(null=True, blank=True)
    store_number = models.CharField(max_length=10, null=True, blank=True)

    # UNUSED
    # category
    # category_id
    # check_number
    # payment_meta
    # account owner
