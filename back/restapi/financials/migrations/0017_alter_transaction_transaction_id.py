# Generated by Django 4.2.4 on 2023-10-11 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0016_rename_new_account_available_plaiditem_new_accounts_available'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='transaction_id',
            field=models.CharField(editable=False, max_length=100, primary_key=True, serialize=False),
        ),
    ]
