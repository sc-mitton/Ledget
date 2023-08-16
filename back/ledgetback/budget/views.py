
from rest_framework.generics import CreateAPIView

from core.permissions import IsAuthenticatedUserOwner
from budget.serializers import (
    BudgetCategorySerializer,
    BillSerializer
)


class CreateCategoryView(CreateAPIView):
    permission_classes = [IsAuthenticatedUserOwner]
    serializer_class = BudgetCategorySerializer


class CreateBillView(CreateAPIView):
    permission_classes = [IsAuthenticatedUserOwner]
    serializer_class = BillSerializer
