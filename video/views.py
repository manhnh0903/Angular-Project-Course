from django.conf import settings
from rest_framework import status
from rest_framework.authtoken.views import APIView
from rest_framework.response import Response
from .models import Video
from .serializers import VideoSerializer
from django.views.decorators.cache import cache_page
from django.core.cache.backends.base import DEFAULT_TIMEOUT

CACHE_TTL = getattr(settings, "CACHE_TTL", DEFAULT_TIMEOUT)

# Create your views here.


# @cache_page(CACHE_TTL)
class VideoView(APIView):

    def get(self, request):
        videos = Video.objects.all()
        serializer = VideoSerializer(videos, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
