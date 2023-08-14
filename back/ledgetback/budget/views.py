
from rest_framework.generics import CreateAPIView

from core.permissions import UserPermissionBundle
from budget.serializers import (
    BudgetCategorySerializer,
    BillSerializer
)


class CreateCategoryView(CreateAPIView):
    permission_classes = [UserPermissionBundle]
    serializer_class = BudgetCategorySerializer


class CreateBillView(CreateAPIView):
    permission_classes = [UserPermissionBundle]
    serializer_class = BillSerializer
