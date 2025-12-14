# ================================
# 1. Node builder for Vite + React
# ================================
FROM node:18-alpine AS node-builder

WORKDIR /app

# Copy package files for caching
COPY package.json package-lock.json vite.config.js ./

# Install node dependencies
RUN npm install

# Copy full project
COPY . .

# Build React assets
RUN npm run build

# ================================
# 2. PHP-FPM + Nginx
# ================================
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libcurl4-openssl-dev \
    pkg-config \
    libssl-dev \
    nginx \
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring xml gd zip \
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

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Remove default nginx config
RUN rm /etc/nginx/sites-enabled/default

# Copy custom nginx config
COPY ./docker/nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Copy supervisor config
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port 80 for HTTP
EXPOSE 80

# Start supervisor (which runs nginx + php-fpm)
CMD ["/usr/bin/supervisord"]
