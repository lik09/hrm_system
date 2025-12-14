# ================================
# 1. Build React frontend
# ================================
FROM node:18-alpine AS node-builder

WORKDIR /app

# Copy only frontend-related files first
COPY resources/js/package.json resources/js/package-lock.json ./resources/js/

# Install dependencies
RUN cd resources/js && npm install

# Copy frontend source
COPY resources/js ./resources/js

# Build React for production
RUN cd resources/js && npm run build   # outputs usually to resources/js/dist or public folder depending on vite.config.js

# ================================
# 2. PHP-FPM + Laravel API
# ================================
FROM php:8.2-fpm

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    git zip unzip curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring tokenizer xml gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel backend
COPY . .

# Copy built frontend to public folder
COPY --from=node-builder /app/resources/js/dist ./public/js

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Laravel permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=9000"]
