#!/usr/bin/env bash
set -euo pipefail

# Render / production build: React frontend + Django backend (same service)
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "==> Installing frontend deps"
npm ci --prefer-offline || npm install

echo "==> Building React (API same-origin /api)"
export REACT_APP_API_URL="${REACT_APP_API_URL:-/api}"
npm run build

echo "==> Installing Python deps"
python -m pip install --upgrade pip
pip install -r backend/requirements.txt

echo "==> Django migrate + seed + collectstatic"
cd backend
python manage.py migrate --noinput
python manage.py seed_data || true
python manage.py collectstatic --noinput
cd "$ROOT"

echo "==> Build complete"
