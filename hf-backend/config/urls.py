from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(_request):
    return JsonResponse({'status': 'ok', 'service': 'youtubeclone-api'})


urlpatterns = [
    path('', health),
    path('health/', health),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
