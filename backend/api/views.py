from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Category, Comment, Video
from .serializers import CategorySerializer, CommentSerializer, VideoSerializer


@api_view(['GET'])
def video_list(request):
    videos = Video.objects.select_related('category').all()
    category = request.query_params.get('category')
    if category:
        videos = videos.filter(category__name__iexact=category)
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def video_detail(request, video_id):
    try:
        video = Video.objects.select_related('category').get(video_id=video_id)
    except Video.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(VideoSerializer(video).data)


@api_view(['GET'])
def search_videos(request):
    q = request.query_params.get('q', '').strip()
    videos = Video.objects.select_related('category').all()
    if q:
        videos = videos.filter(
            Q(title__icontains=q)
            | Q(description__icontains=q)
            | Q(channel_title__icontains=q)
            | Q(category__name__icontains=q)
        )
    return Response(VideoSerializer(videos, many=True).data)


@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    return Response(CategorySerializer(categories, many=True).data)


@api_view(['GET', 'POST'])
def video_comments(request, video_id):
    try:
        video = Video.objects.get(video_id=video_id)
    except Video.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        comments = video.comments.all()
        return Response(CommentSerializer(comments, many=True).data)

    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        comment = serializer.save(video=video)
        video.comment_count = video.comments.count()
        video.save(update_fields=['comment_count'])
        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def like_video(request, video_id):
    try:
        video = Video.objects.get(video_id=video_id)
    except Video.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    video.likes += 1
    video.save(update_fields=['likes'])
    return Response({'video_id': video.video_id, 'likes': video.likes})
