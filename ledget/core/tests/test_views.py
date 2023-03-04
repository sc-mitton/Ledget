from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from core.forms import LoginForm, RegisterForm
from django.contrib.auth import authenticate, login, get_user_model


class TestViews(TestCase):

    def setUp(self):
        self.client = Client(secure=True)
        self.login_url = reverse('login')
        self.register_url = reverse('register')

    def test_get_login_form(self):
        response = self.client.get(self.login_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'user_gateway.html')

    def test_get_register_form(self):
        response = self.client.get(self.register_url)
        self.assertEqual(response.status_code, 200)

    def test_login_successful(self):
        email = 'testuser1@example.com'
        password = 'testpassword'
        User = get_user_model()
        user = User.objects.create_user(email=email, password=password)
        response = self.client.post(
            self.login_url, {'email': email, 'password': password})
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('landing'))

    def test_login_invalid_credentials(self):
        response = self.client.post(
            self.login_url,
            {'email': 'invalid@example.com', 'password': 'invalidpassword'})
        self.assertEqual(response.status_code, 302)
        self.assertTemplateUsed(response, 'user_gateway.html')
        self.assertContains(
            response,
            'The username or password you entered was incorrect.')

    def test_register_successful(self):
        email = 'testuser2@example.com'
        password = 'testpassword'
        response = self.client.post(
            self.register_url,
            {'email': email, 'password': password})
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('landing'))

    def test_register_existing_user(self):
        email = 'newuser@example.com'
        password = 'testpassword'
        User = get_user_model()
        user = User.objects.create_user(email=email, password=password)
        response = self.client.post(
            self.register_url,
            {'email': email, 'password': password})
        self.assertContains(
            response,
            'Email is already taken')

