# Unified YouTubeClone image: React build + Django/Gunicorn
FROM node:20-bookworm AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY public ./public
COPY src ./src
COPY tailwind.config.js postcss.config.js .babelrc ./
ENV REACT_APP_API_URL=/api
ENV CI=false
RUN npm run build

FROM python:3.12-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_DEBUG=False \
    CORS_ALLOW_ALL=True \
    DJANGO_ALLOWED_HOSTS=.onrender.com,localhost,127.0.0.1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend
COPY --from=frontend /app/build ./build

WORKDIR /app/backend
RUN python manage.py collectstatic --noinput \
 && python manage.py migrate --noinput \
 && python manage.py seed_data || true

EXPOSE 8000
CMD gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120
