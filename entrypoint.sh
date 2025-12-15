#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."

until pg_isready \
  -h "${DB_HOST}" \
  -p "${DB_PORT:-5432}" \
  -U "${DB_USERNAME}"; do
  sleep 1
done

echo "PostgreSQL is ready"

# Run migrations
php artisan migrate --force

echo "Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
