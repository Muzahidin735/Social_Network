from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("api/login", views.login_api),
    path("api/signup", views.register_api),
    path("api/profile", views.profile_api),

    path("api/posts", views.post_list_create),
    path("api/posts/<int:post_id>/like", views.like_post),
    path("api/posts/<int:post_id>/dislike", views.dislike_post),
    path("api/posts/<int:post_id>/delete", views.delete_post),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)