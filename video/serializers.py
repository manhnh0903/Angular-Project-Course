from rest_framework import serializers
from .models import Video
from django.conf import settings
from django.contrib.auth.models import User
from djoser.serializers import UserSerializer as BaseUserSerializer


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = "__all__"
        read_only_fields = ["user"]

    def get_video_file(self, video):
        if self.context["request"].method == "GET" and video.video_file:
            return self.context["request"].build_absolute_uri(video.video_file.url)

    def get_thumbnail_file(self, video):
        if self.context["request"].method == "GET" and video.thumbnail_file:
            return self.context["request"].build_absolute_uri(video.thumbnail_file.url)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
