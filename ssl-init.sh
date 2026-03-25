#!/bin/bash
set -e

DOMAIN="tee.su"
EMAIL="web@tee.su"
COMPOSE_FILE="docker-compose.prod.yml"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "→ Stopping nginx to free port 80..."
docker compose -f $COMPOSE_FILE stop nginx

echo "→ Getting SSL certificate..."
certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  -d $DOMAIN \
  -d www.$DOMAIN

echo "→ Activating SSL nginx config..."
cp $PROJECT_DIR/nginx/nginx.ssl.conf $PROJECT_DIR/nginx/nginx.conf

echo "→ Starting nginx with SSL..."
docker compose -f $COMPOSE_FILE up -d nginx

echo ""
echo "✓ SSL configured! Site is available at https://$DOMAIN"
echo ""
echo "→ Setting up auto-renewal (add to crontab -e):"
echo "0 3 * * * certbot renew --quiet && docker compose -f $PROJECT_DIR/$COMPOSE_FILE restart nginx"
