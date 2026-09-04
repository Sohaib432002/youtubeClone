from rest_framework import serializers
from .models import Category, Comment, Video


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_avatar', 'text', 'likes', 'created_at']
        read_only_fields = ['id', 'created_at']


class VideoSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id',
            'video_id',
            'title',
            'description',
            'channel_title',
            'channel_id',
            'thumbnail_url',
            'views',
            'likes',
            'comment_count',
            'category',
            'published_at',
        ]

    def get_category(self, obj):
        return obj.category.name if obj.category else ''

    def get_comment_count(self, obj):
        return obj.comments.count() if hasattr(obj, 'comments') else obj.comment_count
