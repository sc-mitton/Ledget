# Generated by Django 4.2.4 on 2023-09-12 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_device'),
    ]

    operations = [
        migrations.RenameField(
            model_name='device',
            old_name='hash',
            new_name='token',
        ),
        migrations.AddField(
            model_name='device',
            name='mfa',
            field=models.BooleanField(default=False),
        ),
    ]
