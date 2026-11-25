from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from config.validators import validate_non_empty_text

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Public representation of an authenticated user."""

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'date_joined')
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    """Validate and create a new user account."""

    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')
        read_only_fields = ('id',)

    def validate_name(self, value: str) -> str:
        return validate_non_empty_text(value, 'Name')

    def validate_email(self, value: str) -> str:
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return normalized

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

    def create(self, validated_data: dict) -> User:
        return User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
        )


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Authenticate with case-insensitive email and attach user profile to JWT response."""

    def validate(self, attrs: dict) -> dict:
        if 'email' in attrs and isinstance(attrs['email'], str):
            attrs['email'] = attrs['email'].strip().lower()
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
