# Generated by Django 4.2.4 on 2024-01-25 22:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0043_rename_yearly_categories_anchor_user_yearly_anchor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='mfa_method',
            field=models.CharField(choices=[('totp', 'TOTP')], default=None, max_length=4, null=True),
        ),
    ]
