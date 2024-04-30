from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Video
from .tasks import convert720p, convert480p, convert_path
import os
import django_rq


@receiver(post_save, sender=Video)
def video_post_save(sender, instance, created, **kwargs):
    print("video saved")
    if created:
        print("video created")
        queue = django_rq.get_queue("default", autocommit=True)
        queue.enqueue(convert720p, instance.video_file.path)
        queue.enqueue(convert480p, instance.video_file.path)


@receiver(post_delete, sender=Video)
def video_post_delete(sender, instance, **kwargs):
    if instance.video_file:
        path_720p = convert_path(instance.video_file.path, "720p")
        path_480p = convert_path(instance.video_file.path, "480p")

        if os.path.isfile(instance.video_file.path):
            os.remove(instance.video_file.path)
            os.remove(path_720p)
            os.remove(path_480p)
