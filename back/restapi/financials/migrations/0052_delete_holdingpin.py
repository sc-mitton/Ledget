# Generated by Django 4.2.4 on 2025-02-06 21:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0051_alter_useraccount_pinned'),
    ]

    operations = [
        migrations.DeleteModel(
            name='HoldingPin',
        ),
    ]
