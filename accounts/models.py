from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dob = models.DateField()
    profile_pic = models.ImageField(
        upload_to='profile_pics/',
        null=True,
        blank=True
    )
    def __str__(self):
        return self.user.username   
    
class Post(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="posts"
    )
    description = models.TextField()

    image = models.ImageField( 
        upload_to="post_images/",
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    likes = models.ManyToManyField(
        User,
        related_name="liked_posts",
        blank=True
    )
    dislikes = models.ManyToManyField(
        User,
        related_name="disliked_posts",
        blank=True
    )

    def __str__(self):
        return f"Post by {self.user.username}"

