# ---------------------------
# 1. Node builder for React/Vite
# ---------------------------
FROM node:18-alpine AS node-builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json vite.config.js ./

# Install frontend dependencies
RUN npm install

# Copy full project
COPY . .

# Build React assets
RUN npm run build

# ---------------------------
# 2. PHP-FPM + Laravel
# ---------------------------
FROM php:8.2-fpm

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    git zip unzip curl libpng-dev libonig-dev libxml2-dev libzip-dev libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring tokenizer xml gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel project files
COPY . .

# Copy built React assets
COPY --from=node-builder /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set correct permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose HTTP port
EXPOSE 80

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
