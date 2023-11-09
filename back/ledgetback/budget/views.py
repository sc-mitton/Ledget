from datetime import datetime
import calendar
import logging
import pytz

from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.db.models import Sum, Q, Exists, OuterRef, F
from django.db.transaction import atomic

from core.permissions import IsAuthenticated
from budget.serializers import (
    CategorySerializer,
    BillSerializer
)
from budget.models import (
    Category,
    Bill,
    UserCategory,
    TransactionCategory
)
from financials.models import Transaction
from ledgetback.view_mixins import BulkSerializerMixin

logger = logging.getLogger('ledget')


class BillViewSet(BulkSerializerMixin, ModelViewSet):
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
            return self._get_specific_month_qset(int(month), int(year))
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
            yearly_category_anchor = datetime.now()

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
                          .annotate(is_paid=annotation) \

        once_qset = Bill.objects \
                        .filter(userbill__user=self.request.user) \
                        .filter(month=month, year=year) \
                        .annotate(is_paid=annotation) \

        return monthly_qset.union(yearly_qset, once_qset).order_by('name')


class CategoryViewSet(BulkSerializerMixin, ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):

        start = self.request.query_params.get('start', None)
        end = self.request.query_params.get('end', None)

        if start and end:
            try:
                start = datetime.fromtimestamp(int(start), tz=pytz.utc)
                end = datetime.fromtimestamp(int(end), tz=pytz.utc)
            except ValueError:
                return Response(
                    data={'error': 'Invalid date format'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return self._get_queryset_with_sliced_amount_spent(start, end)
        else:
            return self._get_categories_qset()

    @action(detail=False, methods=['POST'], url_path='order')
    def reorder(self, request):
        ids = self.request.data
        try:
            self._reorder(ids)
        except Exception as e:
            logger.warning(e)
            return Response(
                data={'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _reorder(self, ids):
        qset = UserCategory.objects \
                           .filter(category__id__in=ids, user=self.request.user) \
                           .prefetch_related('category')
        map = {str(item.category.id): item for item in qset}
        updated = []

        for i, id in enumerate(ids):
            if id in map:
                map[id].order = i
                updated.append(map[id])
            else:
                raise Exception(f'Invalid category id {id}')

        UserCategory.objects.bulk_update(updated, ['order'])

    @action(detail=False, methods=['POST'], url_path='remove')
    def remove(self, request):

        try:
            ids = request.data
            qset = self._get_categories_qset(ids)
            if any(item.is_default for item in qset):
                raise ValidationError('Cannot delete default category')
        except Exception as e:
            logger.warning(e)
            return Response(
                data={'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    @atomic
    def _remove_items(self, ids):
        qset = self._get_categories_qset(ids)
        self._deactivate_categories(qset)
        self._update_affected_transactions(qset)

    @atomic
    def _deactivate_categories(self, qset):
        updated = []
        for item in qset:
            item.is_active = False
            updated.append(item)
        Category.objects.bulk_update(updated, ['is_active'])

    @atomic
    def _update_affected_transactions(self, stale_categories):
        '''
        For all items in the current month and year,
        set the category to the default category. Past transactions
        will be unaffected.
        '''

        default_category = Category.objects.filter(
            usercategory__user=self.request.user,
            is_default=True
        ).first()

        if not default_category:
            raise Exception('Default category not found')

        transactions_to_update = TransactionCategory.objects.filter(
            category__in=stale_categories
        )

        updated = []
        for item in transactions_to_update:
            item.category = default_category
            updated.append(item)
        Transaction.objects.bulk_update(updated, ['category'])

    def _get_categories_qset(self, ids=None):
        '''
            SELECT
               ...columns
            FROM budget_category"
            INNER JOIN budget_user_category"
            ON (budget_category.id = budget_user_category"."category_id)
            WHERE budget_user_category.user_id = 'user_id_here'
            ORDER BY budget_user_category.order ASC, budget_category.name ASC
        '''
        if ids:
            qset = Category.objects.filter(
                usercategory__user=self.request.user,
                id__in=ids
            ).order_by('usercategory__order', 'name')
        else:
            qset = Category.objects.filter(usercategory__user=self.request.user) \
                                   .order_by('usercategory__order', 'name')

        return qset

    def _get_queryset_with_sliced_amount_spent(self, start: datetime, end: datetime):

        yearly_category_anchor = self.request.user.yearly_anchor
        if not yearly_category_anchor:
            yearly_category_anchor = datetime.utcnow().replace(day=1)

        monthly_amount_spent = Sum(
            F('transactioncategory__transaction__amount') *
            F('transactioncategory__fraction'),
            filter=Q(transactioncategory__transaction__datetime__range=(start, end))
        )

        monthly_qset = Category.objects.filter(
                                   usercategory__user=self.request.user,
                                   usercategory__category__period='month'
                                ) \
                               .annotate(amount_spent=monthly_amount_spent) \
                               .annotate(order=F('usercategory__order')) \

        yearly_amount_spent = Sum(
            F('transactioncategory__transaction__amount') *
            F('transactioncategory__fraction'),
            filter=Q(
                transactioncategory__transaction__datetime__range=(
                    yearly_category_anchor,
                    end),
            )
        )

        yearly_qset = Category.objects \
                              .filter(
                                 usercategory__user=self.request.user,
                                 usercategory__category__period='year'
                               ) \
                              .annotate(amount_spent=yearly_amount_spent) \
                              .annotate(order=F('usercategory__order')) \

        union_qset = monthly_qset.union(yearly_qset).order_by('order', 'name')

        return union_qset
