
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Min, Max, Sum, Q
from django.db.models.functions import ExtractDay, ExtractMonth

from core.permissions import IsAuthenticated
from budget.serializers import (
    CategorySerializer,
    BillSerializer
)
from budget.models import (
    Category,
    Bill
)
from financials.models import Transaction


class BulkCreateMixin:

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super(BulkCreateMixin, self).get_serializer(*args, **kwargs)


class CategoryView(BulkCreateMixin, ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        '''
        SELECT
            ...columns
            SUM(financials_transaction.amount)
                FILTER
                (WHERE EXTRACT(MONTH FROM financials_transaction.date) = date_here)
                AS amount_spent
        FROM budget_category
        LEFT OUTER JOIN financials_transaction
        ON (budget_category.id = financials_transaction.category_id)
        WHERE budget_category.user_id = 'user_id_here'
        GROUP BY budget_category.id
        '''

        month = self.request.query_params.get('month', None)
        year = self.request.query_params.get('year', None)
        s = Sum(
            'transaction__amount',
            filter=Q(transaction__date__month=month, transaction__date__year=year)
        )
        qset = Category.objects.filter(usercategory__user=self.request.user) \
                               .order_by('usercategory__order', 'name') \
                               .annotate(amount_spent=s)

        return qset


class BillView(BulkCreateMixin, ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BillSerializer

    def get_queryset(self):
        return Bill.objects.filter(userbill__user=self.request.user) \
                           .order_by('userbill__order', 'name')


class RecomendedBillsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data = {
            'monthly': self.get_monthly_suggested_bills_qset(request),
            'yearly': self.get_yearly_suggested_bills_qset(request),
        }

        return Response(data=data, status=status.HTTP_200_OK)

    def get_monthly_suggested_bills_qset(self, request, *args, **kwargs):
        '''
        This method will return a queryset of all transactions that are
        likely to be monthly bills that repeat on the same day of the month.
        '''
        qset = Transaction.objects \
                          .filter(
                              account__plaid_item__user_id=request.user.id
                           ) \
                          .annotate(
                              day_of_month=ExtractDay('date'),
                              min_amount=Min('amount'),
                              max_amount=Max('amount'),
                           ) \
                          .values('name', 'day_of_month') \
                          .annotate(count=Count('*')) \
                          .filter(count__gt=4) \
                          .order_by('name', 'day_of_month')

        return qset

    def get_yearly_suggested_bills_qset(self, request, *args, **kwargs):
        '''
        This method will return a queryset of all transactions that are
        likely to be yearly bills that repeat on the same day of each year.
        '''

        qset = Transaction.objects \
                          .filter(
                              account__plaid_item__user_id=request.user.id
                           ) \
                          .annotate(
                              day_of_month=ExtractDay('date'),
                              month_of_year=ExtractMonth('date'),
                              min_amount=Min('amount'),
                              max_amount=Max('amount'),
                           ) \
                          .values('name', 'day_of_month', 'month_of_year') \
                          .annotate(count=Count('*')) \
                          .filter(count__gt=1) \
                          .order_by('name', 'day_of_month', 'month_of_year')

        return qset
