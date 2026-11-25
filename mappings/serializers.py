from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from doctors.serializers import DoctorSerializer
from mappings.models import PatientDoctorMapping


class PatientDoctorMappingSerializer(serializers.ModelSerializer):
    """Serializer for assigning doctors to patients and viewing mappings."""

    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_details = DoctorSerializer(source='doctor', read_only=True)

    class Meta:
        model = PatientDoctorMapping
        fields = (
            'id',
            'patient',
            'patient_name',
            'doctor',
            'doctor_details',
            'assigned_by',
            'notes',
            'assigned_at',
        )
        read_only_fields = ('id', 'patient_name', 'doctor_details', 'assigned_by', 'assigned_at')

    def validate(self, attrs: dict) -> dict:
        request = self.context.get('request')
        patient = attrs.get('patient')
        doctor = attrs.get('doctor')

        if request and patient and patient.created_by_id != request.user.id:
            raise PermissionDenied('You can only assign doctors to your own patients.')

        if patient and doctor:
            if PatientDoctorMapping.objects.filter(patient=patient, doctor=doctor).exists():
                raise serializers.ValidationError(
                    {'non_field_errors': ['This doctor is already assigned to the specified patient.']}
                )

        return attrs
