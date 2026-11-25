import re

from rest_framework import serializers

PHONE_PATTERN = re.compile(r'^\+?[\d\s\-()]{7,20}$')


def validate_phone_number(value: str) -> str:
    """Ensure phone numbers contain 7-20 valid characters and at least 7 digits."""
    cleaned = value.strip()
    digits = re.sub(r'\D', '', cleaned)
    if not PHONE_PATTERN.match(cleaned) or len(digits) < 7:
        raise serializers.ValidationError(
            'Enter a valid phone number containing 7 to 20 digits/formatting characters.'
        )
    return cleaned


def validate_non_empty_text(value: str, field_name: str) -> str:
    """Strip whitespace and reject blank values."""
    cleaned = value.strip()
    if not cleaned:
        raise serializers.ValidationError(f'{field_name} cannot be blank.')
    return cleaned
