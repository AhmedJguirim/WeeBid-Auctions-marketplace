#!/bin/sh
# Refuses to start the production backend with missing, placeholder, short or publicly known secrets.
# (docker-compose already makes them required; this protects against "CHANGE_ME" left in .env.)
[ "$APP_ENV" = "prod" ] || exit 0

bad=0
fail() { echo "[entrypoint] $1"; bad=1; }

for name in APP_SECRET JWT_PASSPHRASE ADMIN_EMAIL ADMIN_PASSWORD SOCKET_PASSWORD; do
    eval "val=\${$name:-}"
    case "$val" in
        "") fail "$name is empty: set it in the private .env (scripts/init-env.sh generates it)" ;;
        *CHANGE_ME*|*change-me*|*changeme*) fail "$name is still a placeholder: set a real value in the private .env" ;;
    esac
done
case "${DATABASE_URL:-}" in
    *CHANGE_ME*|*DB_USER*|*DB_PASSWORD*|*DB_NAME*) fail "DATABASE_URL still has placeholders (DB_NAME / DB_USER / DB_PASSWORD in .env)" ;;
esac

# length
for name in APP_SECRET JWT_PASSPHRASE SOCKET_PASSWORD ADMIN_PASSWORD; do
    eval "val=\${$name:-}"
    min=16; [ "$name" = "ADMIN_PASSWORD" ] && min=10
    [ -z "$val" ] || [ "${#val}" -ge "$min" ] || fail "$name must be at least $min characters"
done

# values that were once published in the repository or in the documentation
for pair in "ADMIN_PASSWORD:admin1234" "ADMIN_PASSWORD:demo1234" "ADMIN_PASSWORD:choose-a-strong-password" \
            "APP_SECRET:f662a8df782e7578fa747765d882aac5" "JWT_PASSPHRASE:54ecd6dc23aa09ca2d708242a8b8bf10"; do
    name="${pair%%:*}"; known="${pair#*:}"
    eval "val=\${$name:-}"
    [ "$val" != "$known" ] || fail "$name uses a value that is public (it was in the repository): generate a new one"
done

if [ "$bad" -ne 0 ]; then
    echo "[entrypoint] refusing to start. Fix the private .env on the server, then run: docker compose up -d"
    exit 1
fi
