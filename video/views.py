from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.authtoken.views import APIView
from rest_framework.response import Response
from .models import Video
from .serializers import VideoSerializer
from django.views.decorators.cache import cache_page
from django.core.cache.backends.base import DEFAULT_TIMEOUT

CACHE_TTL = getattr(settings, "CACHE_TTL", DEFAULT_TIMEOUT)

# Create your views here.#


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by("created_at")
    serializer_class = VideoSerializer
    # permission_classes = [permissions.IsAuthenticated]


class VideoView(APIView):
    # @cache_page(CACHE_TTL)
    def get(self, request):
        videos = Video.objects.all()
        serializer = VideoSerializer(videos, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = VideoSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
