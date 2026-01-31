from datetime import date
from rest_framework import serializers
from django.contrib.auth.models import User


MIN_USERNAME_LENGTH = 1
MAX_USERNAME_LENGTH = 30


def validate_minimum_age(value, min_age=13):
    today = date.today()
    age = today.year - value.year - (
        (today.month, today.day) < (value.month, value.day)
    )

    if age < min_age:
        raise serializers.ValidationError(
            f"You must be at least {min_age} years old."
        )

    return value


def validate_username(value, current_user=None):
    value = value.strip()

    if not value:
        raise serializers.ValidationError(
            "Username cannot be empty."
        )

    if len(value) < MIN_USERNAME_LENGTH:
        raise serializers.ValidationError(
            "Username must be at least 3 characters long."
        )

    if len(value) > MAX_USERNAME_LENGTH:
        raise serializers.ValidationError(
            "Username must be at most 30 characters long."
        )

    if current_user:
        # Update case (exclude self)
        if User.objects.filter(username=value).exclude(
            id=current_user.id
        ).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )
    else:
        # Signup case
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

    return value
