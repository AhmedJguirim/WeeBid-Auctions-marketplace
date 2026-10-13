#!/usr/bin/env bash
# Backs up the database and the uploaded files into ./backups (keeps the last BACKUP_KEEP, default 10).
#   scripts/backup.sh            # run it by hand
#   0 3 * * * /home/ubuntu/WeeBid-Auctions-marketplace/scripts/backup.sh -q   # nightly, via cron
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
[[ "${1:-}" == "-q" ]] && QUIET=1
require_docker

db_running || die "the database container is not running, nothing to back up"

KEEP="$(env_value BACKUP_KEEP 10)"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p backups

step "Dumping the database"
docker compose exec -T db sh -c 'mariadb-dump -u root -p"$MARIADB_ROOT_PASSWORD" --single-transaction --routines --triggers "$MARIADB_DATABASE"' \
  | gzip > "backups/db-$STAMP.sql.gz.part"
[[ -s "backups/db-$STAMP.sql.gz.part" ]] || { rm -f "backups/db-$STAMP.sql.gz.part"; die "the dump is empty"; }
mv "backups/db-$STAMP.sql.gz.part" "backups/db-$STAMP.sql.gz"
ok "backups/db-$STAMP.sql.gz ($(du -h "backups/db-$STAMP.sql.gz" | cut -f1))"

step "Archiving uploads and JWT keys"
if docker compose ps --status running --services | grep -qx backend; then
  docker compose exec -T backend tar czf - -C /var/www/html public/media public/user public/category config/jwt \
    > "backups/files-$STAMP.tar.gz"
  ok "backups/files-$STAMP.tar.gz ($(du -h "backups/files-$STAMP.tar.gz" | cut -f1))"
else
  warn "backend container not running: skipping the files archive"
fi

# keep only the newest $KEEP backups of each kind
for kind in db files; do
  { ls -1t backups/${kind}-* 2>/dev/null || true; } | tail -n +"$((KEEP + 1))" | xargs -r rm -f --
done
say "Backups kept: last $KEEP of each kind in $ROOT/backups"
