#!/bin/bash
set -e

echo "→ Pulling latest code..."
git pull origin main

echo "→ Building images..."
docker compose -f docker-compose.prod.yml build

echo "→ Restarting containers (force recreate)..."
docker compose -f docker-compose.prod.yml up -d --force-recreate

echo "→ Reloading nginx config..."
docker compose -f docker-compose.prod.yml restart nginx

echo "→ Cleaning up old images..."
docker image prune -f

echo "✓ Deploy complete!"
