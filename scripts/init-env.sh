#!/usr/bin/env bash
# Creates the PRIVATE .env (git-ignored) with freshly generated random secrets.
# Nothing sensitive is stored in the repository: only you (and your server) know these values.
#
#   scripts/init-env.sh                                  # asks for the admin e-mail and the public URL
#   scripts/init-env.sh --email me@example.com --url http://203.0.113.10:18080
#   scripts/init-env.sh --upgrade --email me@example.com # existing server: ADD the missing keys, never touch the others
#   scripts/init-env.sh --force                          # overwrite an existing .env (a new database/secrets!)
#
# Note: the database user/name/password are used the FIRST time the database starts. Changing them
# later needs `docker compose down -v` (which erases the data), so keep your .env safe and backed up.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

EMAIL=""; URL=""; UPGRADE=0; FORCE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --email) EMAIL="${2:?--email needs a value}"; shift ;;
    --url) URL="${2:?--url needs a value}"; shift ;;
    --upgrade) UPGRADE=1 ;;
    --force) FORCE=1 ;;
    -h|--help) sed -n '2,11p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done

die() { echo "✘ $*" >&2; exit 1; }

# rand N : N random bytes as hex (2N characters)
rand() {
  if command -v openssl >/dev/null 2>&1; then openssl rand -hex "$1"
  else head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \n'; fi
}

has_key() { grep -qE "^$1=" .env 2>/dev/null; }

if [[ -f .env && "$UPGRADE" == 0 && "$FORCE" == 0 ]]; then
  die ".env already exists. Use --upgrade to add the missing keys, or --force to start over."
fi
[[ -f .env.example ]] || die ".env.example not found (run this from the repository)"

umask 077   # the file is only readable by you

# ---------------------------------------------------------------- upgrade an existing .env
if [[ "$UPGRADE" == 1 ]]; then
  [[ -f .env ]] || die "no .env to upgrade: run without --upgrade"
  added=()
  add() { if ! has_key "$1"; then printf '%s=%s\n' "$1" "$2" >> .env; added+=("$1"); fi; }
  # a database created by an older version used these fixed names: keep them so it still opens
  if ! has_key DB_NAME || ! has_key DB_USER; then
    printf '\n# names of the existing database (created by an older version)\n' >> .env
    add DB_NAME auctionHouse
    add DB_USER weebid
  fi
  add APP_SECRET "$(rand 32)"
  add JWT_PASSPHRASE "$(rand 16)"
  add DB_PASSWORD "$(rand 16)"      # only used if it was missing, i.e. for a database that does not exist yet
  add DB_ROOT_PASSWORD "$(rand 16)"
  add SOCKET_PASSWORD "$(rand 16)"
  if ! has_key ADMIN_EMAIL; then
    [[ -n "$EMAIL" ]] || die "ADMIN_EMAIL is missing: re-run with --email you@example.com"
    add ADMIN_EMAIL "$EMAIL"
  fi
  has_key ADMIN_PASSWORD || add ADMIN_PASSWORD "$(rand 12)"
  has_key PUBLIC_URL || add PUBLIC_URL "${URL:-http://localhost:18080}"
  chmod 600 .env
  if [[ ${#added[@]} -eq 0 ]]; then echo "✔ .env already has every key, nothing to add."
  else echo "✔ added to .env: ${added[*]}"; echo "  (your existing values were not touched)"; fi
  exit 0
fi

# ---------------------------------------------------------------- brand new .env
if [[ -z "$EMAIL" ]]; then
  [[ -t 0 ]] || die "pass --email you@example.com (no terminal to ask you)"
  read -r -p "E-mail of the admin account: " EMAIL
fi
[[ "$EMAIL" == *@*.* ]] || die "'$EMAIL' does not look like an e-mail address"
if [[ -z "$URL" ]]; then
  if [[ -t 0 ]]; then
    read -r -p "Public URL of the site, port included [http://localhost:18080]: " URL
  fi
  URL="${URL:-http://localhost:18080}"
fi

ADMIN_PASSWORD="$(rand 12)"
tmp="$(mktemp)"
# start from the template so comments and options stay, then replace the CHANGE_ME values
while IFS= read -r line; do
  case "$line" in
    PUBLIC_URL=*)       echo "PUBLIC_URL=$URL" ;;
    APP_SECRET=*)       echo "APP_SECRET=$(rand 32)" ;;
    JWT_PASSPHRASE=*)   echo "JWT_PASSPHRASE=$(rand 16)" ;;
    DB_NAME=*)          echo "DB_NAME=weebid_$(rand 3)" ;;
    DB_USER=*)          echo "DB_USER=wb_$(rand 4)" ;;
    DB_PASSWORD=*)      echo "DB_PASSWORD=$(rand 16)" ;;
    DB_ROOT_PASSWORD=*) echo "DB_ROOT_PASSWORD=$(rand 16)" ;;
    SOCKET_PASSWORD=*)  echo "SOCKET_PASSWORD=$(rand 16)" ;;
    ADMIN_EMAIL=*)      echo "ADMIN_EMAIL=$EMAIL" ;;
    ADMIN_PASSWORD=*)   echo "ADMIN_PASSWORD=$ADMIN_PASSWORD" ;;
    *)                  printf '%s\n' "$line" ;;
  esac
done < .env.example > "$tmp"
mv "$tmp" .env
chmod 600 .env

echo "✔ .env created (readable by you only)."
echo
echo "  Admin login:  $EMAIL"
echo "  Admin password (also stored in .env): $ADMIN_PASSWORD"
echo
echo "Next:  docker compose up -d --build"
