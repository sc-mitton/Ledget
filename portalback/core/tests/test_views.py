from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from unittest import skip # noqa
from datetime import datetime, timedelta

USER_ENDPOINT = reverse('user')


class TestCoreApiViews(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.email = 'testuser@example.com'
        self.password = 'testpassword'
        User = get_user_model()
        self.user = User.objects.create_user(
            email=self.email,
            password=self.password
        )

    def test_create_user(self):
        """
        Test the api endpoint for creating a new user.
        It should:
            - create a new user
            - return a 201 status code
            - return a new JWT pair
        """
        email = 'test123@example.com'
        password = 'testpassword123'
        payload = {'email': email, 'password': password}
        response = self.client.post(
            USER_ENDPOINT,
            payload,
            format='json',
            secure=True
        )

        user = get_user_model().objects.get(email=email)
        self.assertEqual(user.email, email)
        self.assertEqual(user.check_password(password), True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('refresh', response.cookies)

    def test_create_user_with_email_that_exists(self):
        """Test that creating a user with an email that already
        exists fails."""
        payload = {'email': self.email, 'password': self.password}
        response = self.client.post(
            USER_ENDPOINT,
            data=payload,
            format='json',
            secure=True
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data.keys())
        self.assertIn('email', response.data['error'])

    def test_token_endpoint_returns_jwt_pair(self):
        """Test that the token endpoint returns a JWT pair."""
        payload = {'email': self.email, 'password': self.password}
        response = self.client.post(
            reverse('token_obtain_pair'),
            data=payload,
            format='json',
            secure=True
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', response.cookies)
        self.assertIn('access', response.cookies)

    def test_refresh_token(self):
        """Test that the refresh token endpoint returns a new JWT pair."""
        payload = {'email': self.email, 'password': self.password}
        response = self.client.post(
            reverse('token_obtain_pair'),
            data=payload,
            format='json',
            secure=True
        )

        response = self.client.post(
            reverse('token_refresh'),
            format='json',
            secure=True
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.cookies)

    def test_error_using_expired_refresh_token(self):
        """Test that trying to obtain a new JWT pair using an expired
        refresh token returns an error."""

        refresh_token = RefreshToken.for_user(self.user)

        token_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
        new_exp = datetime.now() - token_lifetime - timedelta(days=1)
        refresh_token.set_exp(from_time=new_exp)

        new_client = APIClient()
        new_client.cookies['refresh'] = refresh_token

        response = new_client.post(
            reverse('token_refresh'),
            format='json',
            secure=True,
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
