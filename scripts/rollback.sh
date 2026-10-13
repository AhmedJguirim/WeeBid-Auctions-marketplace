#!/usr/bin/env bash
# Puts the server back on an earlier version of the code.
#
#   scripts/rollback.sh              # back to the previously deployed commit
#   scripts/rollback.sh a1b2c3d      # back to a specific commit
#   scripts/rollback.sh -y           # do not ask for confirmation
#
# Deploys are then put on hold (so cron does not immediately redeploy the broken commit).
# When the fix is pushed: scripts/deploy.sh --resume
# The database is NOT touched; restore it with scripts/restore.sh if you need to.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

ASSUME_YES=0; TARGET=""
for arg in "$@"; do
  case "$arg" in
    -y|--yes) ASSUME_YES=1 ;;
    -h|--help) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) TARGET="$arg" ;;
  esac
done

exec 9>"$ROOT/.deploy.lock"
flock -n 9 || die "a deploy is running, try again in a minute"
require_docker
git diff --quiet HEAD -- || die "tracked files were modified on the server (see 'git status')"

HEAD_SHA="$(git rev-parse HEAD)"
if [[ -z "$TARGET" ]]; then
  [[ -s .deploy-history ]] || die "no deploy history yet: pass a commit explicitly (git log --oneline)"
  mapfile -t shas < <(awk '{print $2}' .deploy-history)
  for ((i = ${#shas[@]} - 1; i >= 0; i--)); do
    if [[ "${shas[i]}" != "$HEAD_SHA" ]]; then TARGET="${shas[i]}"; break; fi
  done
  [[ -n "$TARGET" ]] || die "no earlier deploy found in .deploy-history"
fi
git cat-file -e "${TARGET}^{commit}" 2>/dev/null || die "unknown commit: $TARGET"
TARGET="$(git rev-parse "$TARGET")"
[[ "$TARGET" != "$HEAD_SHA" ]] || die "already on $(git rev-parse --short=8 "$TARGET")"

echo "Rolling back:"
echo "  from: $(git --no-pager log -1 --oneline --no-decorate "$HEAD_SHA")"
echo "  to:   $(git --no-pager log -1 --oneline --no-decorate "$TARGET")"
if [[ "$ASSUME_YES" != 1 ]]; then
  read -r -p "Continue? [y/N] " answer
  [[ "$answer" == "y" || "$answer" == "Y" ]] || die "aborted"
fi

git reset --hard "$TARGET" >/dev/null
echo "$TARGET" > .deploy-hold

step "Rebuilding the old version"
docker compose build
docker compose up -d --remove-orphans
step "Waiting for the app to answer"
if wait_healthy "${HEALTH_TIMEOUT:-180}"; then
  echo "$(date -Iseconds) $TARGET $(git rev-parse --abbrev-ref HEAD) (rollback)" >> .deploy-history
  ok "rolled back to $(git rev-parse --short=8 "$TARGET"). Deploys are on hold: 'scripts/deploy.sh --resume' to go back to the latest code"
else
  die "the app is not healthy after the rollback: docker compose logs backend"
fi
