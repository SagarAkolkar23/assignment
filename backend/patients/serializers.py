from rest_framework import serializers

from config.validators import validate_non_empty_text, validate_phone_number
from patients.models import Patient


class PatientSerializer(serializers.ModelSerializer):
    """Serializer for creating, viewing, and updating patient records."""

    class Meta:
        model = Patient
        fields = (
            'id',
            'created_by',
            'name',
            'age',
            'gender',
            'phone',
            'email',
            'address',
            'medical_history',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def validate_name(self, value: str) -> str:
        return validate_non_empty_text(value, 'Patient name')

    def validate_age(self, value: int) -> int:
        if value < 0 or value > 150:
            raise serializers.ValidationError('Age must be between 0 and 150.')
        return value

    def validate_phone(self, value: str) -> str:
        return validate_phone_number(value)

    def validate_email(self, value: str | None) -> str | None:
        if value:
            return value.strip().lower()
        return value
