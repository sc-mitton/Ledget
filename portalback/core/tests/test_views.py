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

from core.models import BillingInfo


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

        self.billing_user_password = 'billingtestpassword'
        self.billing_user_email = 'billingtest@example.com'
        self.user_with_billing = User.objects.create_user(
            email=self.billing_user_email,
            password=self.billing_user_password,
        )
        BillingInfo.objects.create(
            user=self.user_with_billing,
            city='San Francisco',
            state='California',
            postal_code='94110'
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

    def test_price_list_view(self):
        """Test that the product list view returns a list of products."""

        # Login user first
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'email': self.email, 'password': self.password},
            secure=True
        )

        response = self.client.get(reverse('price'), secure=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get('prices')), 2)

    def test_protected_endpoints(self):
        """Test that the protected endpoints return an error when
        unauthenticated."""
        endpoints = [
            {'name': 'update_user', 'args': [self.user.pk], 'method': 'patch'},
            {'name': 'price', 'method': 'get'},
            {'name': 'token_refresh', 'method': 'post'},
        ]
        for endpoint in endpoints:
            request_method = getattr(self.client, endpoint['method'])
            response = request_method(
                reverse(endpoint['name'], args=endpoint.get('args')),
                secure=True
            )
            self.assertEqual(response.status_code,
                             status.HTTP_401_UNAUTHORIZED)

    def test_update_user(self):
        """Test that the user can update their email and password."""

        # Login user first
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'email': self.email, 'password': self.password},
            secure=True
        )

        # Update user
        new_email = 'newemail@example.com'
        endpoint = reverse('update_user', args=[self.user.pk])
        response = self.client.patch(
            endpoint,
            {'email': new_email},
            secure=True
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            get_user_model().objects.filter(email=new_email).exists()
        )

    @skip("for now")
    def test_add_billing_info(self):
        """Test adding billing info to a user."""

        # Login user first
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'email': self.email, 'password': self.password},
            secure=True
        )

        city = "Anchorage"
        state = "Alaska"
        postal_code = "99501"
        payload = {
            'first_name': 'John',
            'last_name': 'Doe',
            'billing_info': {
                'city': city,
                'state': state,
                'postal_code': postal_code
            }
        }

        endpoint = reverse('update_user', args=[self.user.pk])
        response = self.client.patch(
            endpoint,
            payload,
            secure=True,
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user = get_user_model().objects.get(email=self.email)
        self.assertEqual(user.full_name, payload['first_name']
                         + ' ' + payload['last_name'])
        self.assertEqual(user.billing_info.city, city)
        self.assertEqual(user.billing_info.state, state)
        self.assertEqual(user.billing_info.postal_code, postal_code)

    def test_update_billing_info(self):
        # Login user first
        self.client.post(
            reverse('token_obtain_pair'),
            {
                'email': self.billing_user_email,
                'password': self.billing_user_password
            },
            secure=True
        )

        payload = {
            'billing_info': {
                'city': 'New York',
                'state': 'New York',
                'postal_code': '10001'
            }
        }
        endpoint = reverse('update_user', args=[self.user_with_billing.pk])
        self.client.patch(
            endpoint,
            payload,
            secure=True,
            format='json',
        )
        self.user_with_billing.refresh_from_db()
        self.assertEqual(
            self.user_with_billing.billing_info.city,
            payload['billing_info']['city']
        )
        self.assertEqual(
            self.user_with_billing.billing_info.state,
            payload['billing_info']['state']
        )
        self.assertEqual(
            self.user_with_billing.billing_info.postal_code,
            payload['billing_info']['postal_code']
        )
