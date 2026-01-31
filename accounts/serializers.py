from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Post
from .validator import validate_minimum_age, validate_username

class ProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = UserProfile
        fields = ["name", "email", "dob", "profile_pic"]



class ProfileUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    dob = serializers.DateField(
        required=False,                     
        validators=[validate_minimum_age]
    )

    class Meta:
        model = UserProfile
        fields = ["name", "dob", "profile_pic"]

    # Username validation
    def validate_name(self, value):
        current_user = self.instance.user if self.instance else None
        return validate_username(value, current_user)

    # Profile image validation
    def validate_profile_pic(self, value):
        MAX_IMAGE_SIZE = 2 * 1024 * 1024  # 2MB
        ALLOWED_TYPES = ["image/jpeg", "image/png"]

        if value.content_type not in ALLOWED_TYPES:
            raise serializers.ValidationError(
                "Only JPG and PNG images are allowed."
            )

        if value.size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError(
                "Image size must be less than 2 MB."
            )

        return value

    # Correct update logic
    def update(self, instance, validated_data):
        name = validated_data.pop("name", None)

        if name:
            instance.user.username = name
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class PostSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "description",
            "image",
            "likes_count",
            "dislikes_count",
            "is_owner",
            "created_at",
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_dislikes_count(self, obj):
        return obj.dislikes.count()

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request and request.user == obj.user
