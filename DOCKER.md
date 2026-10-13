# Running WeeBid with Docker

Everything (React app, Symfony API, socket.io server, MariaDB) runs from one command:

```console
cp .env.example .env     # optional locally, edit it on a VPS (see below)
docker compose up -d --build
```

| What | URL |
|------|-----|
| The app | `http://<host>:18080/` (`WEB_PORT`) |
| Admin dashboard (EasyAdmin) | `http://<host>:18000/admin` (`ADMIN_PORT`) |
| Default admin login | `admin@weebid.local` / `admin1234` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) |
| Demo members | `amine@weebid.local`, `sarra@weebid.local`, `yassine@weebid.local`, … / `demo1234` |

First start takes a few minutes (image builds). The backend waits for the DB, generates the JWT keys,
creates the DB schema from the entities (the repo ships no migrations), creates the admin user and, unless `SEED_DEMO=false`, fills the database with demo data (5 members, 6 categories, 12 auctions with bid history, 6 reverse auctions). Restarting the stack refreshes the dates of expired demo auctions so the demo never looks dead. The demo content is seeded in French by default; set `SEED_LOCALE=en` for English (use `docker compose down -v` first if the database already exists).

## Languages

The UI is available in French and English (i18next). It picks the language from the browser, remembers the choice in `localStorage` and can be switched with the FR | EN toggle in the navbar. Translations live in `src/i18n/locales/{fr,en}.json`; to add a language, create a JSON file, register it in `src/i18n/index.js` and add it to `languages`. Auction/category texts come from the database, so they stay in the language they were created in (see `SEED_LOCALE`), and validation messages returned by the API are still French.

## How it is wired

```
browser ──> web (nginx, host :18080) ─┬─ /            React build
                             ├─ /api, /media, /user/*.img, /category/*.img  ──> backend (PHP 8.1 + Apache)
                             └─ /socket.io   ──> socket (Node)
backend ──> db (MariaDB)          socket ──> backend (creates notifications)
```

The frontend no longer hardcodes `127.0.0.1:8000`: `src/config/env.js` reads `REACT_APP_BACKEND_URL` /
`REACT_APP_SOCKET_URL` (empty = same origin in Docker; `.env.development` keeps the old values for `npm start`).
The socket server reads `PORT`, `API_URL`, `CORS_ORIGIN`.

## On a VPS

1. Install Docker + the compose plugin, clone the repo.
2. `cp .env.example .env` and **change** `APP_SECRET`, `JWT_PASSPHRASE`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `ADMIN_PASSWORD`,
   and set `PUBLIC_URL` to what users type in the browser (e.g. `http://203.0.113.10:18080`; it must match the browser URL exactly, port included).
3. `docker compose up -d --build`
4. Open ports 18080 (and 18000 for the admin, or set `ADMIN_PORT=127.0.0.1:18000` and use an SSH tunnel).

HTTPS: put Caddy/Traefik/Cloudflare in front of port 18080 (shared reverse proxy for several apps) (nginx already forwards `X-Forwarded-Proto`).
Update `PUBLIC_URL` to the `https://` address.

## Updating the server

There is no CI/CD: you update the server by running a script on it.

```console
cd ~/WeeBid-Auctions-marketplace
scripts/deploy.sh
```

It fetches the branch you are on, backs up the database, fast-forwards the code, builds the new images while the old version keeps serving, restarts the stack and waits until the site and the API answer. If the new version does not become healthy it **goes back to the previous commit by itself**, and puts deploys on hold so nothing retries the broken commit.

| Command | What it does |
|---------|--------------|
| `scripts/deploy.sh` | update if there is something new (does nothing otherwise) |
| `scripts/deploy.sh --force` | rebuild and restart even if nothing changed (e.g. after editing `.env`) |
| `scripts/deploy.sh --branch main` | switch the server to another branch |
| `scripts/deploy.sh --resume` | lift the hold left by a rollback and deploy the latest code |
| `scripts/rollback.sh [commit]` | go back to the previous (or a given) version and hold deploys |
| `scripts/backup.sh` | dump the database and archive the uploads into `./backups` (last 10 kept) |
| `scripts/restore.sh <db.sql.gz> [files.tar.gz]` | restore a backup (asks for confirmation) |

Notes:
- The backend runs `doctrine:schema:update --force` at every start, which can drop columns that were removed from an entity. That is why `deploy.sh` always takes a backup first.
- A rollback restores the code only. Restore the database with `scripts/restore.sh` if a bad release changed data.
- Optional automation with `crontab -e` (replace the path): deploy whatever is pushed every 5 minutes, and back up every night.
  ```
  */5 * * * * /home/ubuntu/WeeBid-Auctions-marketplace/scripts/deploy.sh -q >> /home/ubuntu/deploy.log 2>&1
  0 3 * * *   /home/ubuntu/WeeBid-Auctions-marketplace/scripts/backup.sh -q >> /home/ubuntu/backup.log 2>&1
  ```
  `-q` keeps the logs empty unless something was actually deployed or went wrong.

## Useful commands

```console
docker compose logs -f backend          # watch the backend start
docker compose down                     # stop (data kept)
docker compose down -v                  # stop and wipe DB + uploads + JWT keys
docker compose exec backend php bin/console app:create-admin me@x.com secret
```

## Known limitations (inherited from the original project)

- Real avatars are only supported for demo users; new members get a coloured initial.
- The Symfony `/login` page (admin) clashes with the React `/login` route, hence the separate admin port.
- Public member profiles still expose e-mail/phone through the API (the UI only shows them to the member themself).
