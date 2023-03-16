from django.test import TestCase
from unittest import skip
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from django.urls import reverse


USER_ENDPOINT = reverse('user')


class TestCoreApiViews(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.email = 'testuser@example.com'
        self.password = 'testpassword'
        User = get_user_model()
        self.user = User.objects.create_user(self.email, self.password)

    @skip('Skipping this test for now.')
    def test_create_user(self):
        """
        Test the api endpoint for creating a new user.
        It should:
            - create a new user
            - return a 201 status code
            - return a new JWT pair
        """
        email = 'test123@example.com'
        password = 'testpassword'
        payload = {'email': email, 'password': password}

        response = self.client.post(USER_ENDPOINT,
                                    payload, format='json', secure=True)
        user = get_user_model().objects.get(email=email)
        self.assertEqual(user.email, email)
        self.assertEqual(user.check_password(password), True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access_token', response.cookies)

    @skip('Skipping this test for now.')
    def test_create_user_with_email_that_exists(self):
        """Test that creating a user with an email that already
        exists fails."""
        payload = {'email': self.email, 'password': self.password}
        response = self.client.post(USER_ENDPOINT, payload, format='json',
                                    secure=True)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['email'][0],
                         'user with this email already exists.')

    def test_token_endpoint_returns_jwt_pair(self):
        """Test that the token endpoint returns a JWT pair."""
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'email': self.email, 'password': self.password},
            format='json',
            secure=True
        )
        print(response.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', response.content.decode('utf-8'))

    def test_refresh_token(self):
        """Test that the refresh token endpoint returns a new JWT pair."""
        pass
