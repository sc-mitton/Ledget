
from rest_framework.generics import CreateAPIView
from rest_framework.status import (
    HTTP_207_MULTI_STATUS
)

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

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if isinstance(request.data, list):
            response.status_code = HTTP_207_MULTI_STATUS

        return response


class CreateCategoryView(BulkCreateMixin, CreateAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = CategorySerializer


class CreateBillView(BulkCreateMixin, CreateAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = BillSerializer
