from django.contrib import admin
from .models import Category, Comment, Video


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ['name']


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'channel_title', 'views', 'published_at']
    search_fields = ['title', 'channel_title', 'video_id']
    list_filter = ['category']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'video', 'created_at']
    search_fields = ['author', 'text']
