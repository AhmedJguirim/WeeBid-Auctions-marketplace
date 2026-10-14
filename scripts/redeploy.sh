#!/usr/bin/env bash
# Rebuilds and restarts the app (Symfony backend, React frontend, socket server) from the code
# that is on disk right now. The database is never touched.
#
#   scripts/redeploy.sh               # backup the database, rebuild everything, restart, health check
#   scripts/redeploy.sh --no-cache    # rebuild from scratch (use if a change does not show up)
#   scripts/redeploy.sh --no-backup   # skip the database backup
#   scripts/redeploy.sh -q            # silent unless something goes wrong
#
# Unlike deploy.sh it does not look at git: no fetch, no "already up to date" shortcut, and local
# edits on the server are fine. Use it after editing code (or after a plain 'git pull').
# The data lives in docker volumes (database, uploads, JWT keys): this script never removes them,
# and never runs 'docker compose down'.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

NOCACHE=0; BACKUP=1
usage() { sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; }
while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-cache) NOCACHE=1 ;;
    --no-backup) BACKUP=0 ;;
    -q|--quiet) QUIET=1 ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown option: $1 (try --help)" ;;
  esac
  shift
done

exec 9>"$ROOT/.deploy.lock"
flock -n 9 || die "another deploy is already running"

require_docker

if [[ "$BACKUP" == 1 ]] && db_running; then
  step "Backing up the database"
  backup_args=(); [[ "$QUIET" == 1 ]] && backup_args=(-q)
  "$ROOT/scripts/backup.sh" "${backup_args[@]}" || die "the backup failed: nothing was changed. Fix it or use --no-backup"
fi

step "Building backend, socket and frontend (the running version keeps serving meanwhile)"
build_args=(); [[ "$NOCACHE" == 1 ]] && build_args+=(--no-cache)
docker compose build "${build_args[@]}" backend socket web || die "the build failed. Nothing was restarted, the previous version is still running"

step "Restarting (the database container and its data are left alone)"
docker compose up -d --remove-orphans

step "Waiting for the app to answer (up to 3 min: the backend updates the database schema on start)"
if ! wait_healthy "${HEALTH_TIMEOUT:-180}"; then
  warn "the app did not become healthy. Last backend logs:"
  docker compose logs --tail=40 backend || true
  die "redeploy FAILED. Look at: docker compose logs. Your data is intact (backups are in ./backups)"
fi

docker image prune -f >/dev/null 2>&1 || true
step "Status"
[[ "$QUIET" == 1 ]] || docker compose ps
printf '%s%s ✔ redeployed from the working tree (%s)%s\n' "$GREEN" "$(date '+%F %T')" "$(git rev-parse --short=8 HEAD 2>/dev/null || echo no-git)" "$RESET"
say "Open: $(env_value PUBLIC_URL "http://localhost:$(web_port)")"
say "If the page looks unchanged, hard-refresh the browser (Ctrl+Shift+R)."
