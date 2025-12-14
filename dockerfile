# ================================
# 1. Build React frontend
# ================================
FROM node:18-alpine AS node-builder

WORKDIR /app

# Copy package.json files
COPY js/package.json js/package-lock.json ./js/

# Install frontend dependencies
RUN cd js && npm install

# Copy frontend source
COPY js ./js

# Build React for production
RUN cd js && npm run build

# ================================
# 2. PHP-FPM + Laravel API
# ================================
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git zip unzip curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring tokenizer xml gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel backend
COPY . .

# Copy built React frontend into public/
COPY --from=node-builder /app/js/dist ./public/js

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 9000

# Start Laravel API
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=9000"]
