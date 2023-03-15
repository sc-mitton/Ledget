from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from django.urls import reverse


CREATE_USER_URL = reverse('user')


class TestCoreApiViews(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_create_user(self):
        email = 'test123@example.com'
        password = 'testpassword'
        payload = {'email': email, 'password': password}

        response = self.client.post("https://localhost:8000/api/v1/user/",
                                    payload, format='json', secure=True)
        user = get_user_model().objects.get(email=email)
        self.assertEqual(user.email, email)
        self.assertEqual(user.check_password(password), True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_user_with_email_that_exists(self):
        """Test that creating a user with an email that already
        exists fails."""
        self.test_create_user()
        email = 'test123@example.com'
        password = 'testpassword'
        payload = {'email': email, 'password': password}

        response = self.client.post("https://localhost:8000/api/v1/user/",
                                    payload, format='json', secure=True)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

