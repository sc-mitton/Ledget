"""
Test models
"""

from django.test import TestCase
from django.contrib.auth import get_user_model


class TestModels(TestCase):

    def test_create_new_user(self):
        """Test creating a new user with an email is successful"""
        email = 'test1@example.com'
        first_name = "John"
        last_name = "Doe"
        password = 'testpass123'

        user = get_user_model().objects.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
        )

        self.assertEqual(user.email, email)
        self.assertEqual(user.first_name, first_name)
        self.assertEqual(user.last_name, last_name)
        self.assertEqual(user.is_staff, False)
        self.assertEqual(user.is_superuser, False)

    def test_create_new_superuser(self):
        """Test creating a new superuser"""
        email = 'test2@example.com'
        first_name = "Jane"
        last_name = "Doe"
        password = 'testpass123'

        # create superuser with information
        user = get_user_model().objects.create_superuser(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
        )

        self.assertEqual(user.email, email)
        self.assertEqual(user.first_name, first_name)
        self.assertEqual(user.last_name, last_name)
        self.assertEqual(user.is_staff, True)
        self.assertEqual(user.is_superuser, True)

    def test_email_normalized(self):
        """Test the email for a new user is normalized"""
        sample_emails = [
            ['test3@EXAMPLE.com', "test3@example.com"],
            ['Test4@Example.com', 'Test4@example.com'],
            ['TEST5@EXAMPLE.COM', 'TEST5@example.com'],
            ['test6@example.COM', 'test6@example.com'],
        ]

        for email, expected in sample_emails:
            user = get_user_model().objects.create_user(
                email=email,
                first_name='John',
                last_name='Doe',
                password='password123',
            )
            self.assertEqual(user.email, expected)
