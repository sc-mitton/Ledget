# Generated by Django 4.2.4 on 2024-10-12 16:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0040_accountbalance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accountbalance',
            name='account',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='balances', to='financials.account'),
        ),
    ]
