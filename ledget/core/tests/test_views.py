from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.contrib.auth import get_user_model


class TestViews(TestCase):

    def setUp(self):
        self.client = Client(secure=True)
        self.login_url = reverse('login')
        self.register_url = reverse('register')

        self.email = 'testuser@example.com'
        self.password = 'testpassword'
        self.main_test_user = get_user_model().objects.create_user(
            email=self.email,
            password=self.password
        )
        self.authenticated_client = Client(secure=True)
        self.authenticated_client.force_login(self.main_test_user)

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
        email = 'testuser123@example.com'
        password = 'password123'

        get_user_model().objects.create_user(
                    email=email, password=password)
        response = self.client.post(
                        self.login_url,
                        {'email': email, 'password': "wrongpassword"}
                    )

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login.html')
        self.assertContains(
            response,
            'The username or password you entered was incorrect.'
        )

    def test_register_successful(self):
        email = 'testuser2@example.com'
        password = 'testpassword'
        response = self.client.post(
            self.register_url,
            {'email': email, 'password': password})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'register.html')
        self.assertEqual(response.context['page'], 'checkout')

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
            'Email is already taken'
        )

    def test_authenticated_user_cant_access_login(self):
        response = self.authenticated_client.get(self.login_url)
        self.assertEqual(response.status_code, 302)
        # TODO assert that the app home page is loaded

    def test_inactive_user_goes_to_reactivate(self):
        # TODO
        pass

    def test_active_user_goes_to_app_home(self):
        # TODO
        pass

    def test_unsubscribed_active_user_goes_to_checkout(self):
        # TODO
        pass
