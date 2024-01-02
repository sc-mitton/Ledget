from budget.models import Reminder

# 1 category
single_category_creation_payload = {
    'name': 'Test Category',
    'emoji': '🤑',
    'period': 'month',
    'limit_amount': 10000,
    'alerts': [
        {'percent_amount': 50},
        {'percent_amount': 75}
    ]
}

multiple_category_creation_payload = [
    {
        'name': f'Test Category {i}',
        'emoji': '🤑',
        'period': 'month',
        'limit_amount': 10000,
        'alerts': [
            {'percent_amount': 50},
            {'percent_amount': 75}
        ]
    }
    for i in range(1, 20)
]


reminders = Reminder.objects.all()
number_of_reminders = reminders.count()

if number_of_reminders > 0:
    single_bill_creation_payload = {
        'name': 'Test Bill',
        'emoji': '🤑',
        'period': 'month',
        'day': 1,
        'lower_amount': 1000,
        'upper_amount': 10000,
        'reminders': [
            {'id': str(reminder.id)
                for reminder in reminders[:number_of_reminders // 2]}
        ]
    }
else:
    single_bill_creation_payload = {
        'name': 'Test Bill',
        'emoji': '🤑',
        'period': 'month',
        'day': 1,
        'lower_amount': 1000,
        'upper_amount': 10000
    }


if number_of_reminders > 0:
    multiple_bill_creation_payload = [
        {
            'name': f'Test Bill {i}',
            'emoji': '🤑',
            'period': 'month',
            'day': 1,
            'lower_amount': 1000,
            'upper_amount': 10000,
            'reminders': [
                {'id': str(reminder.id)
                    for reminder in reminders[:number_of_reminders // 2]}
            ]
        }
        for i in range(1, 20)
    ]
else:
    multiple_bill_creation_payload = [
        {
            'name': f'Test Bill {i}',
            'emoji': '🤑',
            'period': 'month',
            'day': 1,
            'lower_amount': 1000,
            'upper_amount': 10000,
        }
        for i in range(1, 20)
    ]
