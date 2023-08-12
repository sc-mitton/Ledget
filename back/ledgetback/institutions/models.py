from django.db import models

# Create your models here.


class Transaction(models.Model):

    class Meta:
        db_table = 'transactions'

    # ID info
    transaction_id = models.CharField(max_length=100, primary_key=True)
    transaction_code = models.CharField(max_length=100, null=True, blank=True)
    transaction_type = models.CharField(max_length=100, null=True, blank=True)

    # Transaction info
    name = models.CharField(max_length=100, null=True, blank=True)
    merchant_name = models.CharField(max_length=100, null=True, blank=True)
    payment_channel = models.CharField(max_length=100, null=True, blank=True)
    pending = models.BooleanField(null=False, blank=False)
    pending_transaction_id = models.CharField(max_length=100, null=True,
                                              blank=True)
    amount = models.IntegerField(null=False, blank=False)
    iso_currency_code = models.CharField(max_length=3, null=False, blank=False)
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
