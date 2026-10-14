#!/bin/sh
set -e
cd /var/www/html

# never run with missing / placeholder / public secrets
sh /usr/local/bin/check-secrets.sh || exit 1

echo "[entrypoint] waiting for the database..."
i=0
until php bin/console dbal:run-sql "SELECT 1" >/dev/null 2>&1; do
    i=$((i+1))
    if [ "$i" -ge 60 ]; then
        echo "[entrypoint] database not reachable, last error:"
        php bin/console dbal:run-sql "SELECT 1" || true
        exit 1
    fi
    sleep 2
done

# JWT keys are git-ignored: generate them once (kept in the jwt volume)
if [ ! -f config/jwt/private.pem ]; then
    echo "[entrypoint] generating JWT keys"
    openssl genpkey -algorithm RSA -out config/jwt/private.pem -aes256 -pass "pass:${JWT_PASSPHRASE}" -pkeyopt rsa_keygen_bits:4096
    openssl pkey -in config/jwt/private.pem -passin "pass:${JWT_PASSPHRASE}" -pubout -out config/jwt/public.pem
fi

echo "[entrypoint] installing bundle assets and warming cache"
php bin/console assets:install public --no-interaction
php bin/console cache:clear --no-interaction

# the repository ships no migrations, so build the schema from the entities
echo "[entrypoint] updating database schema"
php bin/console doctrine:schema:update --force --no-interaction

if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    php bin/console app:create-admin "$ADMIN_EMAIL" "$ADMIN_PASSWORD"
fi

# low-privilege account used by the socket server to create notifications (it is a normal member, not an admin)
if [ -n "$SOCKET_PASSWORD" ]; then
    php bin/console app:create-admin "${SOCKET_USER:-socket@weebid.internal}" "$SOCKET_PASSWORD" --role=ROLE_USER --display-name=weebidsocket --sync-password
fi

chown -R www-data:www-data var public/media public/user public/category config/jwt
chmod 640 config/jwt/*.pem

exec "$@"
