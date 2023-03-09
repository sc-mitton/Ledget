from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse


class TestViews(TestCase):

    def setUp(self):
        self.client = Client()
        User = get_user_model()
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpassword',
        }
        self.user = User.objects.create_user(
            self.user_data['email'],
            self.user_data['password']
        )
        self.login_url = reverse('login')
        self.register_url = reverse('register')
        self.login_template = 'login.html'

    def test_get_register_page(self):
        response = self.client.get(self.register_url, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'register.html')

    def test_get_login_page(self):
        response = self.client.get(self.login_url, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, self.login_template)

    def test_authenticated_user_cant_access_login(self):
        self.client.force_login(self.user)
        response = self.client.get(self.login_url, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateNotUsed(response, self.login_template)

    def test_successful_registration_goes_to_checkout(self):
        email = 'testuser2@example.com'
        password = 'testpassword'
        response = self.client.post(
            self.register_url,
            {'email': email, 'password': password},
            follow=True
        )
        self.assertEqual(response.status_code, 200)

    def test_inactive_user_goes_to_reactivate(self):
        # TODO
        pass

    def test_active_user_goes_to_app_home(self):
        # TODO
        pass

    def test_unsubscribed_active_user_goes_to_checkout(self):
        # TODO
        pass


class AuthenticationTests(TestCase):

    def setUp(self):
        self.client = Client()
        User = get_user_model()
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpassword',
        }
        self.user = User.objects.create_user(
            self.user_data['email'],
            self.user_data['password']
        )
        self.login_url = reverse('login')
        self.register_url = reverse('register')

    def test_valid_login(self):
        pass

    def test_invalid_login(self):
        pass

    def test_register_existing_user(self):
        pass
