# Generated by Django 4.2.4 on 2023-12-24 05:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0026_transaction_is_spend'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='primary_owner',
            field=models.BooleanField(default=True),
        ),
    ]
