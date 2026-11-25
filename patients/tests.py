from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from patients.models import Patient

User = get_user_model()


class PatientAPITests(APITestCase):
    """Tests for authenticated patient CRUD operations and user scoping."""

    def setUp(self):
        self.user_a = User.objects.create_user(
            email='usera@example.com',
            name='User A',
            password='StrongPassword123!',
        )
        self.user_b = User.objects.create_user(
            email='userb@example.com',
            name='User B',
            password='StrongPassword123!',
        )
        self.list_url = reverse('patient-list')
        self.valid_payload = {
            'name': 'John Doe',
            'age': 34,
            'gender': 'Male',
            'phone': '+1-555-234-5678',
            'email': 'John.Doe@example.com',
            'address': '123 Main St',
            'medical_history': 'Mild asthma',
        }

    def test_unauthenticated_access_rejected(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_and_list_own_patients_only(self):
        Patient.objects.create(
            created_by=self.user_b,
            name='Other Patient',
            age=50,
            gender='Female',
            phone='5551112222',
        )
        self.client.force_authenticate(user=self.user_a)

        create_res = self.client.post(self.list_url, self.valid_payload, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_res.data['created_by'], self.user_a.id)
        self.assertEqual(create_res.data['email'], 'john.doe@example.com')

        list_res = self.client.get(self.list_url)
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 1)
        self.assertEqual(list_res.data[0]['name'], 'John Doe')

    def test_retrieve_update_delete_own_patient(self):
        patient = Patient.objects.create(
            created_by=self.user_a,
            name='Jane Doe',
            age=28,
            gender='Female',
            phone='5559876543',
        )
        detail_url = reverse('patient-detail', args=[patient.id])
        self.client.force_authenticate(user=self.user_a)

        get_res = self.client.get(detail_url)
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertEqual(get_res.data['name'], 'Jane Doe')

        put_res = self.client.put(
            detail_url,
            {
                'name': 'Jane Updated',
                'age': 29,
                'gender': 'Female',
                'phone': '5559876543',
                'address': '456 Oak Ave',
            },
            format='json',
        )
        self.assertEqual(put_res.status_code, status.HTTP_200_OK)
        self.assertEqual(put_res.data['name'], 'Jane Updated')
        self.assertEqual(put_res.data['age'], 29)

        del_res = self.client.delete(detail_url)
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Patient.objects.filter(id=patient.id).exists())

    def test_other_user_cannot_access_patient(self):
        patient = Patient.objects.create(
            created_by=self.user_a,
            name='Private Patient',
            age=40,
            gender='Male',
            phone='5550001111',
        )
        detail_url = reverse('patient-detail', args=[patient.id])
        self.client.force_authenticate(user=self.user_b)

        self.assertEqual(self.client.get(detail_url).status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(self.client.delete(detail_url).status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_patient_validation(self):
        self.client.force_authenticate(user=self.user_a)
        bad_payload = {
            'name': '   ',
            'age': 200,
            'gender': 'Male',
            'phone': '123',
        }
        response = self.client.post(self.list_url, bad_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data['details'])
        self.assertIn('age', response.data['details'])
        self.assertIn('phone', response.data['details'])
