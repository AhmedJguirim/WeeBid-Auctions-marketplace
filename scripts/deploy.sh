#!/usr/bin/env bash
# Pulls the latest code from GitHub and updates the running Docker stack.
#
#   scripts/deploy.sh                 # update the current branch if there is something new
#   scripts/deploy.sh --force         # rebuild and restart even if nothing changed
#   scripts/deploy.sh --branch main   # switch to another branch and deploy it
#   scripts/deploy.sh --no-backup     # skip the database backup that normally precedes an update
#   scripts/deploy.sh --resume        # lift the hold left by a rollback and deploy the latest code
#   scripts/deploy.sh -q              # silent unless something happens (for cron)
#
# What it does: fetch -> (backup) -> fast-forward -> build -> restart -> health check.
# If the new version does not come up healthy it goes back to the previous commit by itself.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

FORCE=0; BRANCH=""; BACKUP=1; PRUNE=1; RESUME=0
usage() { sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; }
while [[ $# -gt 0 ]]; do
  case "$1" in
    -f|--force) FORCE=1 ;;
    -b|--branch) BRANCH="${2:?--branch needs a name}"; shift ;;
    --no-backup) BACKUP=0 ;;
    --no-prune) PRUNE=0 ;;
    --resume) RESUME=1 ;;
    -q|--quiet) QUIET=1 ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown option: $1 (try --help)" ;;
  esac
  shift
done

# one deploy at a time (cron + a manual run, for instance)
exec 9>"$ROOT/.deploy.lock"
flock -n 9 || die "another deploy is already running"

command -v git >/dev/null 2>&1 || die "git is not installed"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "$ROOT is not a git repository"
require_docker

# a rollback pins the server on an older commit until you decide otherwise
if [[ -f .deploy-hold ]]; then
  if [[ "$RESUME" == 1 ]]; then
    rm -f .deploy-hold; ok "hold lifted"
  else
    say "Deploys are on hold (pinned on $(cut -c1-8 .deploy-hold)) after a rollback."
    say "Fix the problem, push, then run: scripts/deploy.sh --resume"
    exit 0
  fi
fi

CURRENT="$(git rev-parse --abbrev-ref HEAD)"
[[ "$CURRENT" != "HEAD" ]] || die "detached HEAD: run 'git checkout <branch>' first"
BRANCH="${BRANCH:-$CURRENT}"

git diff --quiet HEAD -- || die "tracked files were modified on the server. See 'git status', then commit, stash or revert them"

step "Fetching origin/$BRANCH"
fetched=0
for attempt in 1 2 3; do
  fetch_args=(--prune); [[ "$QUIET" == 1 ]] && fetch_args+=(-q)
  if git fetch "${fetch_args[@]}" origin "$BRANCH"; then fetched=1; break; fi
  warn "fetch failed (attempt $attempt/3)"; sleep 3
done
[[ "$fetched" == 1 ]] || die "could not fetch from GitHub (network? private repo without a deploy key?)"

if [[ "$BRANCH" != "$CURRENT" ]]; then
  git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH" --track "origin/$BRANCH"
fi

PREV="$(git rev-parse HEAD)"
NEW="$(git rev-parse "origin/$BRANCH")"
short() { git rev-parse --short=8 "$1"; }

running="$(docker compose ps --status running --services 2>/dev/null | wc -l | tr -d ' ')"
if [[ "$PREV" == "$NEW" && "$FORCE" == 0 && "$running" -ge 4 ]]; then
  ok "already up to date ($(short HEAD)), nothing to deploy"
  exit 0
fi

if [[ "$PREV" != "$NEW" ]]; then
  say "Incoming changes:"
  git --no-pager log --oneline --no-decorate "$PREV..$NEW" | sed 's/^/  /' || true
  git --no-pager diff --stat "$PREV" "$NEW" | tail -n 1 | sed 's/^/  /' || true
fi

# first deploy done with these scripts: remember where we started, for rollback
[[ -s .deploy-history ]] || echo "$(date -Iseconds) $PREV $CURRENT (initial)" >> .deploy-history

if [[ "$BACKUP" == 1 ]] && db_running; then
  step "Backing up the database before updating"
  backup_args=(); [[ "$QUIET" == 1 ]] && backup_args=(-q)
  "$ROOT/scripts/backup.sh" "${backup_args[@]}" || die "the backup failed: nothing was changed. Fix it or use --no-backup"
fi

if [[ "$PREV" != "$NEW" ]]; then
  step "Updating the code"
  git merge --ff-only "origin/$BRANCH" >/dev/null || die "cannot fast-forward: the server's history diverged from origin/$BRANCH (see 'git status' and 'git log')"
fi

step "Building the images (the running version keeps serving meanwhile)"
if ! docker compose build; then
  git reset --hard "$PREV" >/dev/null
  die "the build failed. Nothing was restarted, the previous version is still running"
fi

step "Restarting the stack"
docker compose up -d --remove-orphans

step "Waiting for the app to answer (up to 3 min: the backend updates the database schema on start)"
if ! wait_healthy "${HEALTH_TIMEOUT:-180}"; then
  warn "the new version did not become healthy. Last backend logs:"
  docker compose logs --tail=40 backend || true
  warn "rolling back to $(short "$PREV")"
  git reset --hard "$PREV" >/dev/null
  echo "$NEW" > .deploy-hold          # stop cron from retrying the same broken commit
  docker compose build && docker compose up -d --remove-orphans
  if wait_healthy "${HEALTH_TIMEOUT:-180}"; then
    die "deploy of $(short "$NEW") FAILED and was rolled back: the previous version is running again. Fix, push, then 'scripts/deploy.sh --resume'. (The database schema may already have been updated: your pre-deploy backup is in ./backups)"
  fi
  die "deploy FAILED and the rollback is not healthy either. Look at: docker compose logs. Backups are in ./backups"
fi

echo "$(date -Iseconds) $(git rev-parse HEAD) $BRANCH" >> .deploy-history
[[ "$PRUNE" == 1 ]] && docker image prune -f >/dev/null 2>&1 || true

step "Status"
[[ "$QUIET" == 1 ]] || docker compose ps
# always printed, even with -q: it is the one line a cron log should keep
printf '%s%s ✔ deployed %s -> %s on %s%s\n' "$GREEN" "$(date '+%F %T')" "$(short "$PREV")" "$(short HEAD)" "$BRANCH" "$RESET"
say "Open: $(env_value PUBLIC_URL "http://localhost:$(web_port)")"
