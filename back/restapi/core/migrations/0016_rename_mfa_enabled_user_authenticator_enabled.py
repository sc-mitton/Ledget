# Generated by Django 4.2.4 on 2023-09-12 23:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_alter_device_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='mfa_enabled',
            new_name='authenticator_enabled',
        ),
    ]
