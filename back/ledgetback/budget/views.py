from datetime import datetime
import calendar

from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Min, Max, Sum, Q, Exists, OuterRef, F
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
from ledgetback.view_mixins import BulkSerializerMixin


class CategoryView(BulkSerializerMixin, ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):

        month = self.request.query_params.get('month', None)
        year = self.request.query_params.get('year', None)

        if month and year:
            return self._get_queryset_with_sliced_amount_spent(
                int(month), int(year)
            )
        else:
            return self._get_categories_qset()

    def _get_categories_qset(self):
        '''
            SELECT
               ...columns
            FROM budget_category"
            INNER JOIN budget_user_category"
            ON (budget_category.id = budget_user_category"."category_id)
            WHERE budget_user_category.user_id = 'user_id_here'
            ORDER BY budget_user_category.order ASC, budget_category.name ASC
        '''
        qset = Category.objects.filter(usercategory__user=self.request.user) \
                               .order_by('usercategory__order', 'name')

        return qset

    def _get_queryset_with_sliced_amount_spent(self, month: int, year: int):

        time_slice_end = datetime(
            year=year,
            month=month,
            day=calendar.monthrange(year, month)[1]
        )
        yearly_category_anchor = self.request.user.yearly_anchor
        if not yearly_category_anchor:
            yearly_category_anchor = datetime.now().replace(day=1)

        sum_month = Sum(
            'transaction__amount',
            filter=Q(
                transaction__date__month=month,
                transaction__date__year=year,
                transaction__category__isnull=False,
                transaction__bill__isnull=False,
            )
        )
        monthly_qset = Category.objects \
                               .filter(
                                   usercategory__user=self.request.user,
                                   usercategory__category__period='month'
                                ) \
                               .annotate(amount_spent=sum_month) \
                               .annotate(order=F('usercategory__order')) \

        sum_year = Sum(
            'transaction__amount',
            filter=Q(
                transaction__date__gte=yearly_category_anchor,
                transaction__date__lte=time_slice_end,
                transaction__category__isnull=False,
                transaction__bill__isnull=False,
            )
        )
        yearly_qset = Category.objects \
                              .filter(
                                 usercategory__user=self.request.user,
                                 usercategory__category__period='year'
                               ) \
                              .annotate(amount_spent=sum_year) \
                              .annotate(order=F('usercategory__order')) \

        union_qset = monthly_qset.union(yearly_qset).order_by('order', 'name')

        return union_qset


class BillView(BulkSerializerMixin, ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BillSerializer

    def get_queryset(self):
        '''
        If month and year are provided, return the monthly and once bills
        for that month and all yearly bills that fall between the yearly
        anchor and date provided (with an annotation for whether they were paid)

        Otherwise, return all the bills.
        '''
        month = self.request.query_params.get('month', None)
        year = self.request.query_params.get('year', None)

        if month and year:
            return self._get_specific_month_qset(
                int(month), int(year)
            )
        else:
            return Bill.objects.filter(userbill__user=self.request.user)

    def _get_specific_month_qset(self, month, year):
        '''
        Return all of the monthly bills for that month, all the yearly bills,
        and any once bills that are due in that month. Provide annotation
        for each whether they were paid during that month (for monthly and once bills)
        or during the user specific year window (year_)

        month__isnull=True, year__isnull=True
            -> selects monthly bills
        month__gte=yearly_category_anchor.month, month__lte=time_slice_end.month
            -> selects yearly bills for the month
        month=month, year=year
            -> selects once bills for the month
        '''
        time_slice_end = datetime(
            year=year,
            month=month,
            day=calendar.monthrange(year, month)[1]
        )
        yearly_category_anchor = self.request.user.yearly_anchor
        if not yearly_category_anchor:
            yearly_category_anchor = datetime().now()

        annotation = Exists(Transaction.objects.filter(bill=OuterRef('pk')))

        monthly_qset = Bill.objects \
                           .filter(userbill__user=self.request.user) \
                           .filter(month__isnull=True, year__isnull=True) \
                           .annotate(is_paid=annotation) \

        yearly_qset = Bill.objects \
                          .filter(userbill__user=self.request.user) \
                          .filter(
                              month__gte=yearly_category_anchor.month,
                              month__lte=time_slice_end.month) \

        once_qset = Bill.objects \
                        .filter(userbill__user=self.request.user) \
                        .filter(month=month, year=year) \
                        .annotate(is_paid=annotation) \

        return monthly_qset.union(yearly_qset, once_qset).order_by('name')


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
