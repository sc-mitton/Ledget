from django.test import TestCase
from django.contrib.auth import get_user_model
from django.test import Client


class TestViews(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(
            "johndoe@test123.com", "password123"
        )

