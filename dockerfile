# ================================
# 1. Build React (Laravel Mix)
# ================================
FROM node:18-alpine AS node-builder

WORKDIR /app

# Copy only mix-related files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build React assets for production
RUN npm run build


# ================================
# 2. Laravel + PHP-FPM
# ================================
FROM php:8.2-fpm

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    git zip unzip curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring tokenizer xml gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel project
COPY . .

# Copy compiled React assets from node-builder
COPY --from=node-builder /app/public/js ./public/js
COPY --from=node-builder /app/public/css ./public/css
COPY --from=node-builder /app/mix-manifest.json ./public/mix-manifest.json

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Laravel permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose PHP-FPM port
EXPOSE 9000

CMD ["php-fpm"]
