# ================================
# 1. Node builder for Vite + React
# ================================
FROM node:18-alpine AS node-builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json vite.config.js ./

# Install dependencies
RUN npm install

# Copy full frontend + backend project
COPY . .

# Build React assets using Vite
RUN npm run build

# ================================
# 2. Laravel + PHP-FPM
# ================================
FROM php:8.2-fpm

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    git zip unzip curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring tokenizer xml gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel project files
COPY . .

# Copy built React assets from node-builder
COPY --from=node-builder /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Laravel permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose PHP-FPM port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
