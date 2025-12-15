# ---------------------------
# 1. Node builder (Vite / React)
# ---------------------------
FROM node:18-bullseye AS node-builder

WORKDIR /app

COPY package.json package-lock.json vite.config.js ./
RUN npm install

COPY . .
RUN npm run build


# ---------------------------
# 2. PHP + Laravel
# ---------------------------
FROM php:8.2-cli-bullseye

# Install system deps + PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        xml \
        gd \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel source
COPY . .

# Copy built frontend assets
COPY --from=node-builder /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Laravel permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose Laravel port
EXPOSE 8000

# Start container with entrypoint
CMD ["/entrypoint.sh"]
