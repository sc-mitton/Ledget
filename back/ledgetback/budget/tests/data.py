
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


single_bill_creation_payload = {
    'name': 'Test Bill',
    'emoji': '🤑',
    'period': 'month',
    'day': 1,
    'lower_amount': 1000,
    'upper_amount': 10000,
    'reminders': [
        {'period': 'week', 'offset': 1},
        {'period': 'day', 'offset': 2}
    ]
}


multiple_bill_creation_payload = [
    {
        'name': f'Test Bill {i}',
        'emoji': '🤑',
        'period': 'month',
        'day': 1,
        'lower_amount': 1000,
        'upper_amount': 10000,
        'reminders': [
            {'period': 'week', 'offset': 1},
            {'period': 'day', 'offset': 2}
        ]
    }
    for i in range(1, 20)
]
