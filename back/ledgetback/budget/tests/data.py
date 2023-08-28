
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
