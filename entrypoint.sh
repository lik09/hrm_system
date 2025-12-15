#!/bin/bash
set -e

# Wait for PostgreSQL to be ready (optional but recommended)
echo "Waiting for PostgreSQL..."
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME; do
  sleep 1
done

# Run migrations
echo "Running Laravel migrations..."
php artisan migrate --force

# Start Laravel server
echo "Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=8000
