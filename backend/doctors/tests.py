from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from doctors.models import Doctor

User = get_user_model()


class DoctorAPITests(APITestCase):
    """Tests for doctor management CRUD APIs."""

    def setUp(self):
        self.user = User.objects.create_user(
            email='staff@example.com',
            name='Staff User',
            password='StrongPassword123!',
        )
        self.list_url = reverse('doctor-list')
        self.valid_payload = {
            'name': 'Sarah Connor',
            'specialization': 'Cardiology',
            'email': 'Sarah.Connor@hospital.org',
            'phone': '+1 555 888 9999',
            'years_of_experience': 12,
        }

    def test_unauthenticated_access_rejected(self):
        self.assertEqual(self.client.get(self.list_url).status_code, status.HTTP_401_UNAUTHORIZED)

    def test_doctor_crud_flow(self):
        self.client.force_authenticate(user=self.user)

        create_res = self.client.post(self.list_url, self.valid_payload, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        doctor_id = create_res.data['id']
        self.assertEqual(create_res.data['email'], 'sarah.connor@hospital.org')

        list_res = self.client.get(self.list_url)
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 1)

        detail_url = reverse('doctor-detail', args=[doctor_id])
        get_res = self.client.get(detail_url)
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertEqual(get_res.data['specialization'], 'Cardiology')

        put_res = self.client.put(
            detail_url,
            {
                'name': 'Sarah Connor',
                'specialization': 'Interventional Cardiology',
                'email': 'sarah.connor@hospital.org',
                'phone': '+1 555 888 9999',
                'years_of_experience': 14,
            },
            format='json',
        )
        self.assertEqual(put_res.status_code, status.HTTP_200_OK)
        self.assertEqual(put_res.data['years_of_experience'], 14)

        del_res = self.client.delete(detail_url)
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Doctor.objects.filter(id=doctor_id).exists())

    def test_duplicate_doctor_email_rejected(self):
        Doctor.objects.create(
            created_by=self.user,
            name='Existing',
            specialization='Neurology',
            email='sarah.connor@hospital.org',
            phone='5551234567',
            years_of_experience=5,
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.list_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data['details'])

    def test_invalid_doctor_validation(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            self.list_url,
            {
                'name': 'Doc',
                'specialization': '  ',
                'email': 'doc@hospital.org',
                'phone': 'bad',
                'years_of_experience': 95,
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('specialization', response.data['details'])
        self.assertIn('phone', response.data['details'])
        self.assertIn('years_of_experience', response.data['details'])
