from datetime import datetime, timedelta, timezone
import calendar
import logging
import pytz

from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.db.models.functions import ExtractMonth, ExtractYear
from django.db.models import Sum, Q, Exists, OuterRef, F
from django.db.transaction import atomic
from django.utils import timezone as dbtz

from core.permissions import IsAuthenticated
from budget.serializers import (
    CategorySerializer,
    BillSerializer,
    ReminderSerializer,
    SpendingHistorySerializer
)
from budget.models import (
    Category,
    Bill,
    UserCategory,
    Reminder,
)
from financials.models import Transaction, TransactionCategory
from ledgetback.view_mixins import BulkSerializerMixin
from core.permissions import IsObjectOwner

logger = logging.getLogger('ledget')


class ReminderView(ListAPIView):
    serializer_class = ReminderSerializer

    def get_queryset(self):
        return Reminder.objects.all().order_by('period', 'offset')


class BillViewSet(BulkSerializerMixin, ModelViewSet):
    permission_classes = [IsAuthenticated, IsObjectOwner]
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
            return Bill.objects.filter(
                removed_on__isnull=True,
                userbill__user=self.request.user
            )

    def get_object(self):
        bill = Bill.objects.prefetch_related('users').get(pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, bill)
        return bill

    def destroy(self, request, pk=None):
        '''
        Destory a bill. A single bill can be destroyed, or all future bills ('composit')
        or all bills ('all') can be destroyed.
        '''

        which_instances = request.query_params.get('instances', None)
        if not which_instances or which_instances not in ['all', 'single', 'composit']:
            raise ValidationError('Invalid request')

        try:
            self._update_db(which_instances)
        except Exception as e:
            logger.warning(e)
            return Response(data={'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @atomic
    def _update_db(self, which_instances):
        '''
        Set the bill to inactive, and set all of the connected transactions
        for the current month to the default category
        '''
        now = dbtz.now()
        bill = self.get_object()
        self._unlink_transactions(bill, which_instances)

        if which_instances == 'all':
            bill.removed_on = dbtz.now()
        elif which_instances == 'composit':
            bill.removed_on = now.replace(month=now.month + 1).replace(day=0)
        else:
            bill.skipped = True

        bill.save()

    def _unlink_transactions(self, bill, which_instances):

        start = datetime.utcnow().replace(day=1, hour=0,
                                          minute=0, second=0, microsecond=0)
        if which_instances == 'composit':
            start.replace(month=start.month + 1).replace(day=0)

        transactions = Transaction.objects.filter(bill=bill, datetime__gte=start)
        transactions.update(bill=None)

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
        is_paid_annotation = Exists(Transaction.objects.filter(bill=OuterRef('pk')))

        monthly_qset = Bill.objects \
                           .filter(
                               Q(removed_on__month__gt=month) |
                               Q(removed_on__isnull=True),
                               userbill__user=self.request.user,
                               month__isnull=True,
                               year__isnull=True
                            ) \
                           .annotate(is_paid=is_paid_annotation) \

        time_slice_end = datetime(
            year=year,
            month=month,
            day=calendar.monthrange(year, month)[1]
        )
        yearly_category_anchor = self.request.user.yearly_anchor
        if not yearly_category_anchor:
            yearly_category_anchor = datetime.now()

        yearly_qset = Bill.objects \
                          .filter(
                              Q(removed_on__year__gt=year) |
                              Q(removed_on__isnull=True),
                              userbill__user=self.request.user,
                              month__gte=yearly_category_anchor.month,
                              month__lte=time_slice_end.month) \
                          .annotate(is_paid=is_paid_annotation) \

        once_qset = Bill.objects \
                        .filter(
                            userbill__user=self.request.user,
                            removed_on__isnull=True,
                            month=month,
                            year=year
                         ) \
                        .annotate(is_paid=is_paid_annotation) \

        return monthly_qset.union(yearly_qset, once_qset).order_by('name')


class CategoryViewSet(BulkSerializerMixin, ModelViewSet):
    permission_classes = [IsAuthenticated, IsObjectOwner]
    serializer_class = CategorySerializer

    def get_queryset(self):

        start = self.request.query_params.get('start', None)
        end = self.request.query_params.get('end', None)

        if start and end:
            return self._get_timesliced_categories_qset(start, end)
        else:
            return self._get_categories_qset()

    def get_object(self):
        category = Category.objects \
                           .prefetch_related('users') \
                           .prefetch_related('alerts') \
                           .get(pk=self.kwargs['pk'])

        self.check_object_permissions(self.request, category)
        return category

    @action(methods=['delete'], detail=False, url_name='items',
            url_path='items', permission_classes=[IsAuthenticated])
    def remove(self, request):
        category_ids = request.data.get('categories', None)

        if not category_ids:
            raise ValidationError('Invalid request')

        try:
            self._update_db(category_ids)
        except Exception as e:
            logger.warning(e)
            return Response(data={'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get'], detail=True, url_name='spending-history',
            url_path='spending-history', permission_classes=[IsAuthenticated])
    def spending_history(self, request, pk=None):
        monthly_amounts_spent = Transaction.objects.filter(
                transactioncategory__category__id=pk,
                transactioncategory__category__usercategory__user=self.request.user.id
            ).annotate(
                month=ExtractMonth('datetime'),
                year=ExtractYear('datetime')
            ).values('month', 'year').annotate(
                amount_spent=Sum(
                    F('transactioncategory__fraction') *
                    F('transactioncategory__transaction__amount'))
            ).order_by('year', 'month')

        serializer = SpendingHistorySerializer(monthly_amounts_spent, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=False, url_name='order', url_path='order',
            permission_classes=[IsAuthenticated])
    def reorder(self, request):
        try:
            self._reorder(request.data)
        except Exception as e:
            logger.warning(e)
            return Response(
                data={'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST)
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

    @atomic
    def _update_db(self, category_ids):
        '''
        Set the categories to inactive, and set all of the connected transactions
        for the current month to the default category
        '''

        # Update categories
        categories = self._get_categories_from_ids(category_ids)
        categories.update(removed_on=dbtz.now())

        # Set all transactions for the month to the default category
        tz_offset = self.request.data.get('tz', None)
        tz_offset = timedelta(minutes=tz_offset)
        tz = timezone(tz_offset)
        start = datetime.utcnow().replace(tzinfo=tz).replace(
            day=1, hour=0, minute=0, second=0, microsecond=0)
        end = datetime.now().replace(tzinfo=tz).replace(
            minute=0, second=0, microsecond=0)

        # Set all transactions for the period to the default category
        transactioncat_objs = TransactionCategory.objects.filter(
            category_id__in=category_ids,
            transaction__datetime__range=(start, end))

        default_category = self._get_default_category()
        for obj in transactioncat_objs:
            obj.category = default_category
        TransactionCategory.objects.bulk_update(transactioncat_objs, ['category'])

    def _get_categories_from_ids(self, ids):
        return Category.objects.filter(
            usercategory__user=self.request.user,
            id__in=ids)

    def _get_default_category(self) -> Category:
        default_category = Category.objects.filter(
            usercategory__user=self.request.user,
            is_default=True
        ).first()

        if not default_category:
            raise Exception('Default category not found')

        return default_category

    def _get_categories_qset(self, ids=None):
        ''''
        When querying the generic list of categories, the list of
        removed, ie deactivated, categories is excluded. When categories are removed,
        all their transactions for that month are set to the default category, so it's
        no longer needed for categorization or anything else.
        '''

        if ids:
            qset = Category.objects.filter(
                usercategory__user=self.request.user,
                id__in=ids
            ).annotate(order=F('usercategory__order')).order_by('order', 'name')
        else:
            # Else get the active categories
            qset = Category.objects.filter(
                usercategory__user=self.request.user,
                usercategory__category__removed_on__isnull=True
            ).annotate(has_transactions=Exists(
                TransactionCategory.objects.filter(
                    category=OuterRef('pk')
                ))).annotate(order=F('usercategory__order')).order_by('order', 'name')

        return qset

    def _get_timesliced_categories_qset(self, start: str, end: str):

        try:
            start = datetime.fromtimestamp(int(start), tz=pytz.utc)
            end = datetime.fromtimestamp(int(end), tz=pytz.utc)
        except ValueError:
            return Response(
                data={'error': 'Invalid date format'},
                status=status.HTTP_400_BAD_REQUEST)

        include_spending = self.request.query_params.get('spending', True)
        yearly_category_anchor = datetime.utcnow().replace(day=1) \
            if not self.request.user.yearly_anchor else self.request.user.yearly_anchor

        monthly_qset = Category.objects.filter(
            Q(removed_on__gt=end) | Q(removed_on__isnull=True),
            usercategory__user=self.request.user,
            period='month'
        ).annotate(order=F('usercategory__order'))

        yearly_qset = Category.objects.filter(
            Q(removed_on__year__gt=end.year) | Q(removed_on__isnull=True),
            usercategory__user=self.request.user,
            usercategory__category__period='year',
        ).annotate(order=F('usercategory__order'))

        if not include_spending:
            return monthly_qset.union(yearly_qset).order_by('order', 'name')

        monthly_amount_spent = Sum(
            F('transactioncategory__transaction__amount') *
            F('transactioncategory__fraction'),
            filter=Q(transactioncategory__transaction__datetime__range=(start, end))
        )

        yearly_amount_spent = Sum(
            F('transactioncategory__transaction__amount') *
            F('transactioncategory__fraction'),
            filter=Q(transactioncategory__transaction__datetime__range=(
                yearly_category_anchor, end
            ))
        )

        monthly_qset = monthly_qset \
            .annotate(amount_spent=monthly_amount_spent) \
            .exclude(
                Q(amount_spent__isnull=True) | Q(amount_spent=0),
                removed_on__isnull=False)
        yearly_qset = yearly_qset \
            .annotate(amount_spent=yearly_amount_spent) \
            .exclude(
                Q(amount_spent__isnull=True) | Q(amount_spent=0),
                removed_on__isnull=False)

        return monthly_qset.union(yearly_qset).order_by('order', 'name')
