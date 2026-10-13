#!/usr/bin/env bash
# Restores a backup made by backup.sh.
#   scripts/restore.sh backups/db-20261013-031500.sql.gz [backups/files-20261013-031500.tar.gz]
# Without arguments it lists the available backups.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
require_docker

if [[ $# -lt 1 ]]; then
  echo "Usage: scripts/restore.sh <db-backup.sql.gz> [files-backup.tar.gz]"
  echo; echo "Available backups:"; ls -1t backups 2>/dev/null || echo "  (none)"
  exit 1
fi
DB_FILE="$1"; FILES_FILE="${2:-}"
[[ -f "$DB_FILE" ]] || die "$DB_FILE not found"
[[ -z "$FILES_FILE" || -f "$FILES_FILE" ]] || die "$FILES_FILE not found"
db_running || die "the database container is not running (docker compose up -d first)"

echo "This REPLACES the current database${FILES_FILE:+ and the uploaded files} with the backup."
read -r -p "Type 'yes' to continue: " answer
[[ "$answer" == "yes" ]] || die "aborted"

step "Restoring the database"
gunzip -c "$DB_FILE" | docker compose exec -T db sh -c 'mariadb -u root -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"'
ok "database restored from $DB_FILE"

if [[ -n "$FILES_FILE" ]]; then
  step "Restoring uploads and JWT keys"
  docker compose exec -T backend tar xzf - -C /var/www/html < "$FILES_FILE"
  docker compose exec -T backend chown -R www-data:www-data /var/www/html/public/media /var/www/html/public/user /var/www/html/public/category /var/www/html/config/jwt
  ok "files restored from $FILES_FILE"
fi
docker compose restart backend >/dev/null
ok "backend restarted"
