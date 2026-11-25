from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from mappings.models import PatientDoctorMapping
from mappings.serializers import PatientDoctorMappingSerializer
from patients.models import Patient


class MappingListCreateView(generics.ListCreateAPIView):
    """List all patient-doctor mappings for the user's patients, or create a new mapping."""

    serializer_class = PatientDoctorMappingSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return (
            PatientDoctorMapping.objects.filter(patient__created_by=self.request.user)
            .select_related('patient', 'doctor')
        )

    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)


class MappingDetailView(APIView):
    """Retrieve all doctors assigned to a patient (GET) or remove a mapping by ID (DELETE)."""

    permission_classes = (IsAuthenticated,)

    def get(self, request, pk: int):
        patient = get_object_or_404(Patient, pk=pk, created_by=request.user)
        mappings = (
            PatientDoctorMapping.objects.filter(patient=patient)
            .select_related('patient', 'doctor')
        )
        serializer = PatientDoctorMappingSerializer(mappings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk: int):
        mapping = get_object_or_404(
            PatientDoctorMapping,
            pk=pk,
            patient__created_by=request.user,
        )
        mapping.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
