from datetime import datetime, timezone

from django.core.management.base import BaseCommand

from api.models import Category, Comment, Video


SAMPLE_VIDEOS = [
    {
        'video_id': 'u9ncYCyPHtI',
        'title': 'Everything I ate my first day in Boston!',
        'description': 'Food tour highlights from Boston.',
        'channel_title': 'KarissaEats',
        'channel_id': 'UCamdvUq4-BoneYsHZt0Agrw',
        'thumbnail_url': 'https://i.ytimg.com/vi/u9ncYCyPHtI/hqdefault.jpg',
        'views': 9300000,
        'likes': 120000,
        'category': 'Food',
        'published_at': '2025-08-21T14:13:04Z',
    },
    {
        'video_id': '5wFCY-duMX4',
        'title': 'NET lipstick makeup short',
        'description': 'Makeup hack tricks and magic.',
        'channel_title': 'ARCHU KE HACKS',
        'channel_id': 'UCDzYQgdcesGQzLBIXRVVkGw',
        'thumbnail_url': 'https://i.ytimg.com/vi/5wFCY-duMX4/hqdefault.jpg',
        'views': 2100000,
        'likes': 45000,
        'category': 'Beauty',
        'published_at': '2025-07-03T06:43:59Z',
    },
    {
        'video_id': '0TRNSZdvID4',
        'title': 'Best friend ka dar',
        'description': 'Funny couple shorts.',
        'channel_title': 'Khwahish Gal',
        'channel_id': 'UCh_la0EpAokx5PChAMCH2Bw',
        'thumbnail_url': 'https://i.ytimg.com/vi/0TRNSZdvID4/hqdefault.jpg',
        'views': 1500000,
        'likes': 32000,
        'category': 'Entertainment',
        'published_at': '2025-08-19T12:25:50Z',
    },
    {
        'video_id': 'xs_auAmh7MA',
        'title': 'SPOILING my sister for her Birthday',
        'description': 'Birthday surprise reaction.',
        'channel_title': 'JUSTKASS',
        'channel_id': 'UCMCMjTKUqJ1pUzmHnKrmiCA',
        'thumbnail_url': 'https://i.ytimg.com/vi/xs_auAmh7MA/hqdefault.jpg',
        'views': 8000000,
        'likes': 210000,
        'category': 'Vlog',
        'published_at': '2023-05-24T15:00:49Z',
    },
    {
        'video_id': 'BZ9rH4xKMBQ',
        'title': '2 Numberi song ft. Masoom sharma',
        'description': 'Music short.',
        'channel_title': 'Neha Tanwar',
        'channel_id': 'UCvB5vKkfu4JR7IyxajkE_KQ',
        'thumbnail_url': 'https://i.ytimg.com/vi/BZ9rH4xKMBQ/hqdefault.jpg',
        'views': 5600000,
        'likes': 98000,
        'category': 'Music',
        'published_at': '2024-09-12T12:56:03Z',
    },
    {
        'video_id': 'LuAFkBGioYY',
        'title': 'That Foodie funny short',
        'description': 'Comedy food short.',
        'channel_title': 'Praveen Pranav',
        'channel_id': 'UCf5_MpffBB9OJ2a2jPFMJRQ',
        'thumbnail_url': 'https://i.ytimg.com/vi/LuAFkBGioYY/hqdefault.jpg',
        'views': 3200000,
        'likes': 67000,
        'category': 'Comedy',
        'published_at': '2025-07-16T07:30:08Z',
    },
    {
        'video_id': 'vFjiUJ74A_k',
        'title': 'Which one do you prefer?',
        'description': 'Stationery tips.',
        'channel_title': 'Stationery Pal',
        'channel_id': 'UC_oFAJ3Xha1_mZENuR1Vj9Q',
        'thumbnail_url': 'https://i.ytimg.com/vi/vFjiUJ74A_k/hqdefault.jpg',
        'views': 1100000,
        'likes': 22000,
        'category': 'Education',
        'published_at': '2025-08-26T13:08:00Z',
    },
    {
        'video_id': 'ibV3iGwqyY8',
        'title': 'School teachers and Independence day',
        'description': 'School short.',
        'channel_title': 'Sejal Gaba',
        'channel_id': 'UCW-V3lJDUSz_AccP6rPRUtA',
        'thumbnail_url': 'https://i.ytimg.com/vi/ibV3iGwqyY8/hqdefault.jpg',
        'views': 4400000,
        'likes': 88000,
        'category': 'Entertainment',
        'published_at': '2025-08-13T08:32:33Z',
    },
]


class Command(BaseCommand):
    help = 'Seed sample categories, videos, and comments for local development'

    def handle(self, *args, **options):
        created_videos = 0
        for item in SAMPLE_VIDEOS:
            category, _ = Category.objects.get_or_create(name=item['category'])
            published = datetime.fromisoformat(item['published_at'].replace('Z', '+00:00'))
            video, created = Video.objects.update_or_create(
                video_id=item['video_id'],
                defaults={
                    'title': item['title'],
                    'description': item['description'],
                    'channel_title': item['channel_title'],
                    'channel_id': item['channel_id'],
                    'thumbnail_url': item['thumbnail_url'],
                    'views': item['views'],
                    'likes': item['likes'],
                    'category': category,
                    'published_at': published,
                },
            )
            if created:
                created_videos += 1
                Comment.objects.create(
                    video=video,
                    author='Demo User',
                    text='Great video! (seeded comment)',
                    likes=3,
                )
                video.comment_count = 1
                video.save(update_fields=['comment_count'])

        self.stdout.write(
            self.style.SUCCESS(
                f'Seed complete. Categories: {Category.objects.count()}, '
                f'Videos: {Video.objects.count()} (new: {created_videos})'
            )
        )
