from pathlib import Path

from django.contrib import admin
from django.http import FileResponse, Http404
from django.urls import include, path, re_path
from django.views.generic import TemplateView

from django.conf import settings


def spa_asset(request, path):
    """Serve root-level CRA assets (favicon, manifest, Logo.svg, etc.)."""
    build = Path(settings.BASE_DIR).parent / 'build'
    file_path = (build / path).resolve()
    if not str(file_path).startswith(str(build.resolve())) or not file_path.is_file():
        raise Http404
    return FileResponse(open(file_path, 'rb'))


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve React SPA when build/ exists (production / unified host)
_build = Path(settings.BASE_DIR).parent / 'build'
if _build.exists():
    urlpatterns += [
        re_path(
            r'^(?P<path>(favicon\.(ico|svg|png)|manifest\.json|Logo\.svg|robots\.txt|asset-manifest\.json))$',
            spa_asset,
        ),
        re_path(r'^(?!api/|admin/|static/).*$', TemplateView.as_view(template_name='index.html')),
    ]
