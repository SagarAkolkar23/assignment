from rest_framework import serializers

from config.validators import validate_non_empty_text, validate_phone_number
from doctors.models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    """Serializer for creating, viewing, and updating doctor records."""

    class Meta:
        model = Doctor
        fields = (
            'id',
            'created_by',
            'name',
            'specialization',
            'email',
            'phone',
            'years_of_experience',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def validate_name(self, value: str) -> str:
        return validate_non_empty_text(value, 'Doctor name')

    def validate_specialization(self, value: str) -> str:
        return validate_non_empty_text(value, 'Specialization')

    def validate_email(self, value: str) -> str:
        normalized = value.strip().lower()
        queryset = Doctor.objects.filter(email__iexact=normalized)
        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError('A doctor with this email already exists.')
        return normalized

    def validate_phone(self, value: str) -> str:
        return validate_phone_number(value)

    def validate_years_of_experience(self, value: int) -> int:
        if value < 0 or value > 80:
            raise serializers.ValidationError('Years of experience must be between 0 and 80.')
        return value
