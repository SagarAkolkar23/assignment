from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from doctors.models import Doctor
from mappings.models import PatientDoctorMapping
from patients.models import Patient

User = get_user_model()


class MappingAPITests(APITestCase):
    """Tests for assigning, querying, and removing patient-doctor mappings."""

    def setUp(self):
        self.user_a = User.objects.create_user(
            email='a@example.com',
            name='User A',
            password='StrongPassword123!',
        )
        self.user_b = User.objects.create_user(
            email='b@example.com',
            name='User B',
            password='StrongPassword123!',
        )
        self.patient_a = Patient.objects.create(
            created_by=self.user_a,
            name='Patient A',
            age=30,
            gender='Male',
            phone='5551112222',
        )
        self.doctor_1 = Doctor.objects.create(
            created_by=self.user_a,
            name='Dr. House',
            specialization='Diagnostics',
            email='house@hospital.org',
            phone='5553334444',
            years_of_experience=15,
        )
        self.doctor_2 = Doctor.objects.create(
            created_by=self.user_a,
            name='Dr. Wilson',
            specialization='Oncology',
            email='wilson@hospital.org',
            phone='5555556666',
            years_of_experience=12,
        )
        self.list_url = reverse('mapping-list-create')

    def test_assign_list_filter_and_delete_mapping(self):
        self.client.force_authenticate(user=self.user_a)

        res_1 = self.client.post(
            self.list_url,
            {'patient': self.patient_a.id, 'doctor': self.doctor_1.id, 'notes': 'Initial consult'},
            format='json',
        )
        self.assertEqual(res_1.status_code, status.HTTP_201_CREATED)
        mapping_id_1 = res_1.data['id']
        self.assertEqual(res_1.data['doctor_details']['name'], 'Dr. House')

        self.client.post(
            self.list_url,
            {'patient': self.patient_a.id, 'doctor': self.doctor_2.id},
            format='json',
        )

        list_res = self.client.get(self.list_url)
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 2)

        by_patient_url = reverse('mapping-detail', args=[self.patient_a.id])
        patient_doctors_res = self.client.get(by_patient_url)
        self.assertEqual(patient_doctors_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(patient_doctors_res.data), 2)

        delete_url = reverse('mapping-detail', args=[mapping_id_1])
        del_res = self.client.delete(delete_url)
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PatientDoctorMapping.objects.filter(patient=self.patient_a).count(), 1)

    def test_duplicate_mapping_rejected(self):
        PatientDoctorMapping.objects.create(
            patient=self.patient_a,
            doctor=self.doctor_1,
            assigned_by=self.user_a,
        )
        self.client.force_authenticate(user=self.user_a)
        response = self.client.post(
            self.list_url,
            {'patient': self.patient_a.id, 'doctor': self.doctor_1.id},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cannot_manage_other_users_patient_mappings(self):
        mapping = PatientDoctorMapping.objects.create(
            patient=self.patient_a,
            doctor=self.doctor_1,
            assigned_by=self.user_a,
        )
        self.client.force_authenticate(user=self.user_b)

        post_res = self.client.post(
            self.list_url,
            {'patient': self.patient_a.id, 'doctor': self.doctor_2.id},
            format='json',
        )
        self.assertEqual(post_res.status_code, status.HTTP_403_FORBIDDEN)

        get_res = self.client.get(reverse('mapping-detail', args=[self.patient_a.id]))
        self.assertEqual(get_res.status_code, status.HTTP_404_NOT_FOUND)

        del_res = self.client.delete(reverse('mapping-detail', args=[mapping.id]))
        self.assertEqual(del_res.status_code, status.HTTP_404_NOT_FOUND)
