from django.test import TestCase
from django.test import Client
from django.contrib.auth import get_user_model
import uuid


class ViewTests(TestCase):

    def setup(self):
        '''Create user and client'''
        self.client = Client()
        self.user = get_user_model().objects.create_superuser(id=uuid.uuid4())

    def test_bulk_category_creation(self):
        pass

    def test_bulk_bill_creation(self):
        pass
