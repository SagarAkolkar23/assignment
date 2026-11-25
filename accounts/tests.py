from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthenticationTests(APITestCase):
    """Tests for user registration, JWT login, and token refresh."""

    def setUp(self):
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.refresh_url = reverse('auth-token-refresh')
        self.user_payload = {
            'name': 'Alice Smith',
            'email': 'Alice@Example.com',
            'password': 'StrongPassword123!',
        }

    def test_register_success(self):
        response = self.client.post(self.register_url, self.user_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['email'], 'alice@example.com')
        self.assertEqual(response.data['user']['name'], 'Alice Smith')
        self.assertNotIn('password', response.data['user'])
        user = User.objects.get(email='alice@example.com')
        self.assertTrue(user.check_password('StrongPassword123!'))

    def test_register_duplicate_email_rejected(self):
        User.objects.create_user(
            email='alice@example.com',
            name='Alice',
            password='StrongPassword123!',
        )
        response = self.client.post(self.register_url, self.user_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status_code'], 400)
        self.assertIn('email', response.data['details'])

    def test_register_weak_password_rejected(self):
        payload = {**self.user_payload, 'password': 'password123'}
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data['details'])

    def test_login_success_and_token_refresh(self):
        User.objects.create_user(
            email='alice@example.com',
            name='Alice Smith',
            password='StrongPassword123!',
        )
        login_res = self.client.post(
            self.login_url,
            {'email': 'ALICE@example.com', 'password': 'StrongPassword123!'},
            format='json',
        )
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_res.data)
        self.assertIn('refresh', login_res.data)
        self.assertEqual(login_res.data['user']['email'], 'alice@example.com')

        refresh_res = self.client.post(
            self.refresh_url,
            {'refresh': login_res.data['refresh']},
            format='json',
        )
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_res.data)

    def test_login_invalid_credentials_returns_401(self):
        User.objects.create_user(
            email='alice@example.com',
            name='Alice Smith',
            password='StrongPassword123!',
        )
        response = self.client.post(
            self.login_url,
            {'email': 'alice@example.com', 'password': 'WrongPassword!'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
