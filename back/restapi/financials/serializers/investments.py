from rest_framework import serializers


class InvestmentsSerializer(serializers.Serializer):
    pass


'''
Data I need returned:

- balance for each investment account
- Holdings for each investment account
- Balance History for each investment account

[
    {
        account_id: number,
        balance_history: [
            { date: string, balance: number }
            ...
        ],
        holdings: [
            { name: string, quantity: number, value: number }
            ...
        ]
    }
]

'''
request = InvestmentsTransactionsGetRequest(
    access_token=access_token,
    start_date=date.fromisoformat('2024-03-01'),
    end_date=date.fromisoformat('2024-10-01'),
    options=InvestmentsTransactionsGetRequestOptions()
)
