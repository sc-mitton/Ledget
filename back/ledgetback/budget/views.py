
from rest_framework.generics import CreateAPIView

from core.permissions import IsAuthedVerifiedSubscriber
from budget.serializers import (
    BudgetCategorySerializer,
    BillSerializer
)


class CreateCategoryView(CreateAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = BudgetCategorySerializer


class CreateBillView(CreateAPIView):
    permission_classes = [IsAuthedVerifiedSubscriber]
    serializer_class = BillSerializer
