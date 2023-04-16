from django.test import TestCase
from unittest import skip # noqa
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

import jwt
from datetime import datetime, timedelta

from core.models import Price


class TestCoreApiViews(TestCase):
    fixtures = ['prices.json', 'users.json', 'customers.json']

    def setUp(self):
        User = get_user_model()
        self.client = APIClient()

        self.email = 'testuser@example.com'
        self.password = 'testpassword'
        self.user = User.objects.create_user(
            email=self.email,
            password=self.password
        )

        # Users from the fixtures
        self.fixture_user_email1 = "testcustomer1@example.com"
        self.fixture_user_email2 = "testcustomer2@example.com"
        # NOTE: the passwords in the fixtures are all 'testpassword123'
        self.fixture_password = "testpassword123"

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
            reverse('create_user'),
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
            reverse('create_user'),
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

    def test_token_endpoint_response(self):
        """Test that the response from the token endpoint contains the
        necessary fields."""

        payload = {'email': self.email, 'password': self.password}
        response = self.client.post(
            reverse('token_obtain_pair'),
            data=payload,
            format='json',
            secure=True
        )
        self.assertIn('access_token_expiration', response.data)

        self.assertIn('user', response.data)
        self.assertIn('email', response.data['user'])
        self.assertIn('is_customer', response.data['user'])
        self.assertIn('subscription_status', response.data['user'])

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
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
        # Make sure cookies are delete
        self.assertEqual(response.cookies['refresh'].value, '')
        self.assertEqual(response.cookies['access'].value, '')

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

    def test_price_list_view(self):
        """Test that the product list view returns a list of products."""

        # Login user first
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'email': self.email, 'password': self.password},
            secure=True
        )

        response = self.client.get(reverse('prices'), secure=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        number_of_prices = len(response.data)
        self.assertEqual(
            (number_of_prices > 0 and number_of_prices <= 4), True
        )

    def test_protected_endpoints(self):
        """
        Test that the protected endpoints return an error when
        unauthenticated.
        """

        endpoints = [
            {'name': 'prices', 'method': 'get'},
            {'name': 'update_user', 'args': [self.user.pk], 'method': 'patch'},
            {'name': 'create_customer', 'method': 'post'},
            {'name': 'create_subscription', 'method': 'post'}
        ]
        for endpoint in endpoints:
            request_method = getattr(self.client, endpoint['method'])
            response = request_method(
                reverse(endpoint['name'], args=endpoint.get('args')),
                secure=True,
            )
            self.assertEqual(response.status_code,
                             status.HTTP_401_UNAUTHORIZED)

    def test_subscription_create_with_invalid_trial_period(self):
        """Test that creating a subscription with an invalid trial period
        is invalid."""

        # Login first
        self.client.post(
            reverse('token_obtain_pair'),
            {
                'email': self.fixture_user_email1,
                'password': self.fixture_password
            },
            secure=True
        )

        price = Price.objects.first()
        # Attempt subscription creationg
        response = self.client.post(
            reverse('create_subscription'),
            {
                'trial_period_days': price.trial_period_days + 1,
                'price_id': price.id
            },
            format='json',
            secure=True
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid trial period.',
                      response.data['non_field_errors'][0])

    def test_not_customer_cant_create_sub(self):
        """Test that a user that is not a customer can't
        create a subscription."""

        # Login first
        self.client.post(
            reverse('token_obtain_pair'),
            {
                'email': self.email,
                'password': self.password
            },
            secure=True
        )

        price = Price.objects.first()
        # Attempt subscription creationg
        response = self.client.post(
            reverse('create_subscription'),
            {
                'trial_period_days': price.trial_period_days,
                'price_id': price.id
            },
            format='json',
            secure=True
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Only customers can create subscriptions.',
                      response.data['non_field_errors'][0])
