from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Video(models.Model):
    video_id = models.CharField(max_length=64, unique=True)
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    channel_title = models.CharField(max_length=200)
    channel_id = models.CharField(max_length=64, blank=True, default='local')
    thumbnail_url = models.URLField(max_length=500)
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='videos'
    )
    published_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title


class Comment(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='comments')
    author = models.CharField(max_length=120, default='Guest')
    author_avatar = models.URLField(max_length=500, blank=True)
    text = models.TextField()
    likes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.author}: {self.text[:40]}'
