
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Min, Max
from django.db.models.functions import ExtractDay, ExtractMonth

from core.permissions import IsAuthedVerifiedSubscriber
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
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class BillView(BulkCreateMixin, ListCreateAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = BillSerializer

    def get_queryset(self):
        return Bill.objects.filter(user=self.request.user)


class RecomendedBillsView(APIView):
    permission_classes = [IsAuthedVerifiedSubscriber]

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
