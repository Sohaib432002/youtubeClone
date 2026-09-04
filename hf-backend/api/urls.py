from django.urls import path
from . import views

urlpatterns = [
    path('videos/', views.video_list, name='video-list'),
    path('videos/<str:video_id>/', views.video_detail, name='video-detail'),
    path('videos/<str:video_id>/comments/', views.video_comments, name='video-comments'),
    path('videos/<str:video_id>/like/', views.like_video, name='video-like'),
    path('search/', views.search_videos, name='search'),
    path('categories/', views.category_list, name='categories'),
]
