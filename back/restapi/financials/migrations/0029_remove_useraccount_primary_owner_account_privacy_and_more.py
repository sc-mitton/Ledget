# Generated by Django 4.2.4 on 2024-04-27 01:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0028_plaiditem_pending_expired'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='useraccount',
            name='primary_owner',
        ),
        migrations.AddField(
            model_name='account',
            name='privacy',
            field=models.CharField(choices=[('private', 'Private'), ('shared', 'Shared'), ('hidden', 'Hidden')], default='private', max_length=10),
        ),
        migrations.AddField(
            model_name='plaiditem',
            name='privacy',
            field=models.CharField(choices=[('private', 'Private'), ('shared', 'Shared'), ('hidden', 'Hidden')], default='private', max_length=10),
        ),
        migrations.AddField(
            model_name='transaction',
            name='privacy',
            field=models.CharField(choices=[('private', 'Private'), ('shared', 'Shared'), ('hidden', 'Hidden')], default='shared', max_length=10),
        ),
    ]
