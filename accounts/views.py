from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ProfileSerializer, ProfileUpdateSerializer, PostSerializer
from rest_framework import status



from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile, Post

@api_view(['POST'])
def logout(request):
    return Response({"message": "Logout successful. Delete token on client."})


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def register_api(request):
    username = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")
    dob = request.data.get("dob")
    profile_pic = request.FILES.get("profile-pic")

    if not all([username, email, password, dob]):
        return Response({"error": "All fields are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    UserProfile.objects.create(
        user=user,
        dob=dob,
        profile_pic=profile_pic
    )

    return Response({"message": "User registered successfully"}, status=201)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):
    email = request.data.get("username")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password required"},
            status=400
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid email or password"},
            status=401
        )

    authenticated_user = authenticate(
        username=user.username,
        password=password
    )

    if authenticated_user is None:
        return Response(
            {"error": "Invalid email or password"},
            status=401
        )

    refresh = RefreshToken.for_user(authenticated_user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    })

        
@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile_api(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
    # 🔁 Auto-create missing profile
        profile = UserProfile.objects.create(
            user=request.user,
            dob="2000-01-01"  # or some default safe value
        )
        
    if request.method == "GET":
        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)

    if request.method == "PATCH":
        update_serializer = ProfileUpdateSerializer(
            profile,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if not update_serializer.is_valid():
            # 🔍 THIS WILL SHOW THE REAL ERROR IN CONSOLE
            print("PROFILE UPDATE ERRORS:", update_serializer.errors)
            return Response(update_serializer.errors, status=400)

        update_serializer.save()

        # ✅ ALWAYS return READ serializer
        read_serializer = ProfileSerializer(
            profile,
            context={"request": request}
        )
        return Response(read_serializer.data)

    
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def post_list_create(request):
    if request.method == "GET":
        posts = Post.objects.all().order_by("-created_at")
        serializer = PostSerializer(posts, many=True, context={"request": request})

        return Response(serializer.data)

    if request.method == "POST":
        description = request.data.get("description")
        image = request.FILES.get("image")

        if not description:
            return Response(
                {"error": "Description is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        post = Post.objects.create(
            user=request.user,
            description=description,
            image = image
        )

        serializer = PostSerializer(post,context={"request": request})

        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    post.likes.add(request.user)
    post.dislikes.remove(request.user)

    return Response({"message": "Post liked"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def dislike_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    post.dislikes.add(request.user)
    post.likes.remove(request.user)

    return Response({"message": "Post disliked"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id, user=request.user)
    except Post.DoesNotExist:
        return Response(
            {"error": "Not allowed or post not found"},
            status=403
        )

    post.delete()
    return Response({"message": "Post deleted"})
