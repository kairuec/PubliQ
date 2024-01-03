FROM php:8.1-apache

COPY --from=composer:2.4 /usr/bin/composer /usr/bin/composer
COPY ./backend/000-default.conf /etc/apache2/sites-available/000-default.conf

RUN apt-get update && apt-get install -y zip unzip && \
    docker-php-ext-install pdo pdo_mysql bcmath

WORKDIR /var/www

RUN echo "Listen 8080" >> /etc/apache2/ports.conf && \
    a2enmod rewrite