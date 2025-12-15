#!/bin/bash
set -e

echo "Starting Laravel..."

# Clear caches safely
php artisan config:clear || true
php artisan route:clear || true

# Run migrations in background (do NOT block)
(
  sleep 5
  php artisan migrate --force || true
) &

# Start server immediately (Render requirement)
exec php artisan serve \
  --host=0.0.0.0 \
  --port="${PORT}"
