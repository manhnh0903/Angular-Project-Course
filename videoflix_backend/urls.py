from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from authentication import views as auth_views
from video import views as video_views
from django.conf import settings
from django.conf.urls.static import static
from authentication.views import LoginView

router = routers.DefaultRouter()
router.register(r"users", auth_views.UserViewSet)
# router.register(r"videos", video_views.VideoViewSet)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("login/", LoginView.as_view(), name="login"),
    path("__debug__/", include("debug_toolbar.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
