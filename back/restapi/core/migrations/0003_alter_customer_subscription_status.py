# Generated by Django 4.2.4 on 2023-08-17 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_rename_provisioned_until_customer_period_end_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='subscription_status',
            field=models.CharField(choices=[('incomplete', 'Incomplete'), ('incomplete_expired', 'Incomplete Expired'), ('trialing', 'Trialing'), ('active', 'Active'), ('past_due', 'Past Due'), ('canceled', 'Canceled'), ('paused', 'Paused')], default=None, max_length=20, null=True),
        ),
    ]
