FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_DEBUG=False \
    CORS_ALLOW_ALL=True \
    DJANGO_ALLOWED_HOSTS=* \
    PORT=7860

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Persist SQLite inside the container working dir (ephemeral on free Spaces)
RUN python manage.py migrate --noinput \
 && python manage.py seed_data || true \
 && python manage.py collectstatic --noinput || true

EXPOSE 7860

CMD gunicorn config.wsgi:application \
    --bind 0.0.0.0:7860 \
    --workers 2 \
    --timeout 120
