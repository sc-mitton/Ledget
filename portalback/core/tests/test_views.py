from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

import jwt
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

    def test_wrong_credentials_login(self):
        """Test that trying to log in with wrong credentials returns
        an error."""

        response = self.client.post(
            reverse('token_obtain_pair'),
            data={'email': self.email, 'password': 'wrongpassword'},
            format='json',
            secure=True
        )

        self.assertTrue(response.status_code >= 400
                        and response.status_code < 500)

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
        self.assertIn('email', response.data.keys())

    def test_token_endpoint_returns_jwt_pair(self):
        """Test that the token endpoint returns a JWT pair when logging in."""
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
        """Test that the refresh token endpoint returns a new access token."""
        payload = {'email': self.email, 'password': self.password}
        response = self.client.post(
            reverse('token_obtain_pair'),
            data=payload,
            format='json',
            secure=True
        )
        access_token1 = response.cookies['access']

        response = self.client.post(
            reverse('token_refresh'),
            secure=True
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.cookies['access'], access_token1)

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

    def test_logout(self):
        """Test that the logout endpoint deletes the refresh token from
        the cookies and blacklists it."""

        # Make sure client has a refresh token
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'email': self.email, 'password': self.password},
            format='json',
            secure=True
        )
        refresh_token = response.cookies['refresh']

        # Log out the user
        response = self.client.post(
            reverse('logout'),
            format='json',
            secure=True
        )

        # Make sure cookies are unset
        self.assertNotIn('refresh', response.cookies)
        self.assertNotIn('access', response.cookies)

        # Make sure the token is blacklisted
        decoded_token = jwt.decode(
            refresh_token.value,
            settings.SECRET_KEY,
            algorithms=['HS256']
        )
        jti = decoded_token.get("jti")
        self.assertEqual(
            BlacklistedToken.objects.filter(token__jti=jti).exists(), True
        )

        response = self.client.post(reverse('token_refresh'), secure=True)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
