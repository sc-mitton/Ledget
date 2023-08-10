
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsUserOwner
from serializers import BudgetCategorySerializer


# Create your views here.
class CreateCategoryView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsUserOwner]
    serializer_class = BudgetCategorySerializer
