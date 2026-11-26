#!/bin/bash
# Ночной бэкап БД: дамп на диск сервера (14 дней) + копия в S3 (30 дней).
# Ключи S3 берутся из backend/.env — отдельного конфига rclone нет.
# Запуск: cron root, `bash /var/www/tee-su/backup.sh`.
set -euo pipefail
cd "$(dirname "$0")"

env_get() { grep -m1 "^$1=" backend/.env | cut -d= -f2- | tr -d '\r'; }

LOCAL_DIR=/root/backups
FILE="$LOCAL_DIR/teesu-$(date +%Y%m%d).sql.gz"

mkdir -p "$LOCAL_DIR"
docker exec tee-su-db pg_dump -U postgres teesu | gzip > "$FILE"
find "$LOCAL_DIR" -name 'teesu-*.sql.gz' -mtime +14 -delete

export RCLONE_CONFIG_S3_TYPE=s3
export RCLONE_CONFIG_S3_PROVIDER=Other
export RCLONE_CONFIG_S3_ENDPOINT="$(env_get S3_ENDPOINT)"
export RCLONE_CONFIG_S3_REGION="$(env_get S3_REGION)"
export RCLONE_CONFIG_S3_ACCESS_KEY_ID="$(env_get S3_ACCESS_KEY)"
export RCLONE_CONFIG_S3_SECRET_ACCESS_KEY="$(env_get S3_SECRET_KEY)"
REMOTE="s3:$(env_get S3_BUCKET)/backups"

# Объекты без ACL — приватные, даже когда медиа в том же бакете публичные.
rclone copy --s3-no-check-bucket "$FILE" "$REMOTE/"
rclone delete --s3-no-check-bucket --min-age 30d "$REMOTE/"

echo "$(date -u +%FT%TZ) ok $(du -h "$FILE" | cut -f1) → $REMOTE"
