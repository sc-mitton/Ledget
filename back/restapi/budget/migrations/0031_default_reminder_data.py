import json
import os

from django.db import migrations
from django.conf import settings


def get_reminder_fixture():
    reminder_fixture_path = ''
    for fixture_dir in settings.FIXTURE_DIRS:
        for file in os.listdir(fixture_dir):
            if 'reminder' in file:
                reminder_fixture_path = os.path.join(fixture_dir, file)
                break
    return reminder_fixture_path


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0030_remove_userbill_primary_owner_and_more'),
    ]

    def insertData(apps, schema_editor):
        reminder_fixture_path = get_reminder_fixture()
        if not reminder_fixture_path:
            raise Exception('Reminder fixture not found')

        with open(reminder_fixture_path) as f:
            reminders = json.load(f)
            for reminder in reminders:
                Reminder = apps.get_model('budget', 'Reminder')
                Reminder.objects.create(**reminder['fields'])

    operations = [
        migrations.RunPython(insertData),
    ]
