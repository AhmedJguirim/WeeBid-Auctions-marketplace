# Running WeeBid with Docker

Everything (React app, Symfony API, socket.io server, MariaDB) runs from one command:

```console
scripts/init-env.sh              # creates YOUR private .env with random secrets (git-ignored)
docker compose up -d --build
```

| What | URL |
|------|-----|
| The app | `http://<host>:18080/` (`WEB_PORT`) |
| Admin dashboard (EasyAdmin) | `http://localhost:18000/admin` (`ADMIN_PORT`); login = the e-mail and password printed by `init-env.sh` (`ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`) |
| Demo members | `amine@weebid.local`, `sarra@weebid.local`, `yassine@weebid.local`, … / `demo1234` (public on purpose, see `SEED_DEMO`) |

## Secrets and configuration

**Nothing secret is stored in the repository or in a Docker image.** The repository only contains templates
(`.env.example`, `backend/.env.example`) with `CHANGE_ME` placeholders. Everything you must keep private lives in the
`.env` at the root of the project, which is git-ignored and exists only on your machine / your server:

| Variable | What it is |
|----------|-----------|
| `APP_SECRET`, `JWT_PASSPHRASE` | signing secrets of the API (sessions, login tokens) |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ROOT_PASSWORD` | the database: names and passwords |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | the administrator account of the dashboard |
| `SOCKET_PASSWORD` | password of the internal account used by the real-time server |

`scripts/init-env.sh` generates all of them randomly (file mode 600). Docker Compose passes them to the containers when
they **start**; images are built without them, so they can be rebuilt, shared or published safely. There is no default
value: Compose stops if one is missing, and the backend refuses to start if one is still a `CHANGE_ME`, too short, or
one of the values that used to be published in the repository.

- **Back up your `.env`** (a password manager is fine): without it you cannot reach your database again.
- The database name, user and passwords are used the first time the database starts. To change them later you need
  `docker compose down -v`, which **erases the data**. Everything else can be changed any time: edit `.env` and run `scripts/deploy.sh --force`.
- Use letters and digits only in passwords (they end up in a URL); the generated ones are hexadecimal.
- **Existing server** created before this change? `git pull`, then `scripts/init-env.sh --upgrade` (adds the missing keys,
  keeps the database names that already exist and never touches your other values), then `scripts/deploy.sh --force`.
- The old `backend/.env` that used to be committed contained a development `APP_SECRET` and `JWT_PASSPHRASE`. They are still in the git history, so never use them anywhere (the backend rejects them).

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
2. `scripts/init-env.sh --email you@example.com --url http://203.0.113.10:18080` creates the private `.env` **on the server**
   (the URL is what users type in the browser, port included). Note the admin password it prints. Set `SEED_DEMO=false` in `.env` for a private installation without demo members.
3. `docker compose up -d --build`
4. Open port 18080 in the firewall. The admin dashboard is only bound to the server itself (`ADMIN_PORT=127.0.0.1:18000`): reach it through an SSH tunnel (`ssh -L 18000:127.0.0.1:18000 user@server`, then http://localhost:18000/admin).

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

## Limits and protection

The stack is meant to run on a small public VPS, so every layer has limits:

| Layer | Protection |
|-------|-----------|
| **nginx** (`docker/nginx/default.conf`) | per-IP rate limits: 30 req/s overall, 15 req/s on the API, 1 write/s, 10 logins/min, 1 sign-up/min (+ small bursts), 10 uploads/min; 40 connections per IP; JSON bodies capped at 64 KB, uploads at 6 MB; short timeouts. Over the limit the answer is a JSON `429` / `413` and the UI shows a message. Behind Caddy/another proxy it reads the real IP from `X-Forwarded-For` (private ranges only). |
| **Uploads** | JPEG / PNG / WebP / GIF only (checked on the content, not the file name), 5 MB, 6000 px max, 4 images per article, only while the article is not published yet, random file names, and PHP/HTML execution disabled in the upload folders. |
| **API** | reading is public, every write needs a logged-in member; a member can have at most 30 running auctions and 30 running reverse auctions; length limits on text fields. |
| **Socket server** | per-IP connection cap, per-connection event rate limit (then disconnection), 100 KB messages, every bid/request is verified against the API before being announced, personal notification rooms need the member's token. |
| **Containers** | memory / CPU / process caps on every service, log rotation, Apache limited to 20 workers, MariaDB to 60 connections. |

To tune a limit, edit the file and run `scripts/deploy.sh --force`.

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
