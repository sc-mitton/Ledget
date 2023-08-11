
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsUserOwner
from budget.serializers import (
    BudgetCategorySerializer,
    BillSerializer
)


# Create your views here.
class CreateCategoryView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsUserOwner]
    serializer_class = BudgetCategorySerializer


class CreateBillView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsUserOwner]
    serializer_class = BillSerializer
