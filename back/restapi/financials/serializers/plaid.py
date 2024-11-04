from rest_framework import serializers

from financials.models import Transaction
from .constants import (
    NOT_SPEND_DETAILED,
    IS_INVESTMENTS_DETAIL,
    IS_INCOME_DETAIL
)


class PlaidTransactionSerializer(serializers.ModelSerializer):
    '''
    Serialzier for formatting transactinos fetched from plaid api
    '''

    class Meta:
        model = Transaction
        fields = '__all__'
        extra_kwargs = {'transaction_id': {'read_only': False}}

    def to_internal_value(self, data):
        data['account'] = data.get('account_id')
        data.update(data['location'])
        value = super().to_internal_value(data)

        # Decide whether or not it is an investment transaction
        if data.get('personal_finance_category', {}).get('detailed', '').upper() \
                in IS_INVESTMENTS_DETAIL:
            value['detail'] = Transaction.Detail.INVESTMENT_TRANSFER_OUT

        # Decide if it's income
        if data.get('personal_finance_category', {}).get('detailed', '').upper() \
                in IS_INCOME_DETAIL:
            value['detail'] = Transaction.Detail.INCOME

        # Decide whether or not it is a spend transaction
        is_null_detail = any([
            data.get('personal_finance_category', {})
                .get('detailed', '').upper() in NOT_SPEND_DETAILED,
            (data.get('personal_finance_category', {})
                .get('detailed', '').upper() == 'TRANSFER_OUT_ACCOUNT_TRANSFER' and
                all('THIRD PARTY' != c.upper() for c in data.get('category')))
        ])

        # If it is a spend transaction, set the detail to SPENDING
        is_spend = not is_null_detail and not value.get('detail')

        if is_spend:
            value['detail'] = Transaction.Detail.SPENDING

        return value

    def to_representation(self, instance):
        repr = super().to_representation(instance)
        repr['account_id'] = repr.pop('account')
        return repr
