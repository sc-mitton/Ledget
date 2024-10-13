from rest_framework import serializers
from django.db.models import Prefetch

from financials.models import Account, Institution


class StudentLoanSerializer(serializers.Serializer):
    account_id = serializers.CharField()
    product_not_supported = serializers.BooleanField(required=False)
    account_number = serializers.CharField(required=False)
    disbursement_dates = serializers.ListField(required=False)
    expected_payoff_date = serializers.DateField(required=False)
    guarantor = serializers.CharField(required=False)
    interest_rate_percentage = serializers.FloatField(required=False)
    is_overdue = serializers.BooleanField(required=False)
    last_payment_amount = serializers.FloatField(required=False)
    last_payment_date = serializers.DateField(required=False)
    last_statement_balance = serializers.FloatField(required=False)
    last_statement_issue_date = serializers.DateField(required=False)
    loan_name = serializers.CharField(required=False)
    loan_status = serializers.DictField(required=False)
    minimum_payment_amount = serializers.FloatField(required=False)
    next_payment_due_date = serializers.DateField(required=False)
    origination_date = serializers.DateField(required=False)
    origination_principal_amount = serializers.FloatField(required=False)
    outstanding_interest_amount = serializers.FloatField(required=False)
    payment_reference_number = serializers.CharField(required=False)
    pslf_status = serializers.DictField(required=False)
    repayment_plan = serializers.DictField(required=False)
    sequence_number = serializers.CharField(required=False)
    servicer_address = serializers.DictField(required=False)
    ytd_interest_paid = serializers.FloatField(required=False)
    ytd_principal_paid = serializers.FloatField(required=False)


class MortgageSerializer(serializers.Serializer):
    account_id = serializers.CharField()
    product_not_supported = serializers.BooleanField(required=False)
    account_number = serializers.CharField(required=False)
    disbursement_dates = serializers.ListField(required=False)
    expected_payoff_date = serializers.DateField(required=False)
    guarantor = serializers.CharField(required=False)
    interest_rate_percentage = serializers.FloatField(required=False)
    is_overdue = serializers.BooleanField(required=False)
    last_payment_amount = serializers.FloatField(required=False)
    last_payment_date = serializers.DateField(required=False)
    last_statement_balance = serializers.FloatField(required=False)
    last_statement_issue_date = serializers.DateField(required=False)
    loan_name = serializers.CharField(required=False)
    loan_status = serializers.DictField(required=False)
    minimum_payment_amount = serializers.FloatField(required=False)
    next_payment_due_date = serializers.DateField(required=False)
    origination_date = serializers.DateField(required=False)
    origination_principal_amount = serializers.FloatField(required=False)
    outstanding_interest_amount = serializers.FloatField(required=False)
    payment_reference_number = serializers.CharField(required=False)
    pslf_status = serializers.DictField(required=False)
    repayment_plan = serializers.DictField(required=False)
    sequence_number = serializers.CharField(required=False)
    servicer_address = serializers.DictField(required=False)
    ytd_interest_paid = serializers.FloatField(required=False)
    ytd_principal_paid = serializers.FloatField(required=False)


class LiabilitiesSerializer(serializers.Serializer):
    student = StudentLoanSerializer(many=True)
    mortgage = MortgageSerializer(many=True)

    def to_representation(self, instance):
        repr = super().to_representation(instance)
        account_ids = [a['account_id'] for a in repr['student']] + \
            [a['account_id'] for a in repr['mortgage']]

        values = ['name', 'type', 'subtype']
        accounts = Account.objects \
            .filter(id__in=account_ids) \
            .prefetch_related(
                Prefetch(
                    'institution',
                    queryset=Institution.objects.only('id', 'name', 'primary_color')
                ),
            )

        for v in values:
            for i in range(len(repr['student'])):
                account = next(
                    acc for acc in accounts
                    if acc.id == repr['student'][i]['account_id']
                )
                repr['student'][i][v] = getattr(account, v)
                repr['student'][i]['institution'] = {
                    'id': account.institution.id,
                    'name': account.institution.name,
                    'primary_color': account.institution.primary_color
                }
            for i in range(len(repr['mortgage'])):
                account = next(
                    acc for acc in accounts
                    if acc.id == repr['mortgage'][i]['account_id']
                )
                repr['mortgage'][i][v] = getattr(account, v)
                repr['mortgage'][i]['institution'] = {
                    'id': account.institution.id,
                    'name': account.institution.name,
                    'primary_color': account.institution.primary_color
                }

        return repr
