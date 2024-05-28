from django.db import models
from datetime import date
from django.contrib.auth.models import User


class Video(models.Model):
    VISIBILITY_CHOICES = [
        ("public", "Public"),
        ("private", "Private"),
    ]

    GENRE_CHOICES = [
        ("fitness", "Fitness"),
        ("animals", "Animals"),
        ("landscapes", "Landscapes"),
    ]

    created_at = models.DateField(default=date.today)
    title = models.CharField(max_length=80)
    description = models.CharField(max_length=500)
    video_file = models.FileField(upload_to="videos", blank=True, null=True)
    thumbnail_file = models.FileField(upload_to="thumbnails", blank=True, null=True)
    visibility = models.CharField(
        max_length=7, choices=VISIBILITY_CHOICES, default="public"
    )
    genre = models.CharField(max_length=10, choices=GENRE_CHOICES, default="fitness")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
