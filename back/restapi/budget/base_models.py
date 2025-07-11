import uuid

from django.db import models
from restapi.models.base import BaseSharedModel


class BudgetItem(BaseSharedModel):

    class Meta:
        abstract = True

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, null=False, blank=False)
    emoji = models.CharField(max_length=10, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    removed_on = models.DateTimeField(null=True, blank=True)


class Notification(models.Model):

    class Meta:
        abstract = True

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
