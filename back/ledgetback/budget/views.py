
from rest_framework.generics import CreateAPIView

from core.permissions import IsAuthedVerifiedSubscriber
from budget.serializers import (
    CategorySerializer,
    BillSerializer
)


class BulkCreateMixin:

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super(BulkCreateMixin, self).get_serializer(*args, **kwargs)


class CreateCategoryView(CreateAPIView, BulkCreateMixin):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = CategorySerializer


class CreateBillView(CreateAPIView, BulkCreateMixin):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = BillSerializer
