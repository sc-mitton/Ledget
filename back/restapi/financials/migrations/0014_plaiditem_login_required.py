# Generated by Django 4.2.4 on 2023-09-29 18:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0013_alter_transaction_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='plaiditem',
            name='login_required',
            field=models.BooleanField(default=False),
        ),
    ]
