# Generated by Django 4.2.4 on 2023-10-27 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0014_alter_bill_period'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usercategory',
            name='order',
            field=models.IntegerField(default=0),
        ),
    ]
