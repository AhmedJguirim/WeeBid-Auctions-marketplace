<div align="center">

# WeeBid — online auction marketplace

**Buy, sell and negotiate through live auctions, reverse auctions and quote requests.**
My first full-stack web project: React · Symfony · Node.js (Socket.io) · MariaDB

<img src="docs/screenshots/home.png" alt="WeeBid homepage" width="860">

</div>

## Developer Note
This version of the application was sort of an MVP/Proof of concept for an idea that the company hosting my internship had. It was one of my first steps into web development and i learned a lot making this app. Due to internal issues in the company, the work on the project didn't continue and the idea was abandoned. So i am using it as a portfolio project. The app is by no means ready for production usage in its current condition, but it can make a good, opensource starting point if you're going to build a bidding application.

## Main features

- **Auctions** with live countdown, bid history and a seller dashboard (close, edit dates, manage bids).
- **Reverse auctions** and **quote requests / proposals** between members.
- **Real-time prices and notifications** pushed to every open browser with Socket.io.
- **Watch list**: follow an auction and get notified on every new bid.
- **Accounts**: sign up, JWT authentication, editable profile, public member pages.
- **Search and browsing** by category, member or keyword, with pagination.
- **Photo uploads** for listings and an **admin dashboard** (EasyAdmin) to manage all the data.
- **Responsive**, available in **French and English**.

<table>
  <tr>
    <td><img src="docs/screenshots/auctions.png" alt="Auction list"></td>
    <td><img src="docs/screenshots/auction.png" alt="Auction page with live countdown and bidding"></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/auctions-mobile.png" alt="Mobile homepage" width="230"></td>
    <td align="center"><img src="docs/screenshots/auction-mobile.png" alt="Mobile auction page" width="230"></td>
  </tr>
</table>

## Tech stack

| | |
|---|---|
| **Frontend** | React 17, Redux, React Router, Formik, Axios, Tailwind CSS, i18next |
| **Backend** | Symfony 5.4, API Platform, Doctrine ORM, JWT (Lexik), EasyAdmin |
| **Real-time** | Node.js + Socket.io |
| **Database** | MariaDB / MySQL |

```
 Browser (React) ──► Symfony REST API ──► MariaDB
        │                    ▲
        └── Socket.io ──► Node server (verifies bids, creates notifications)
```

## Installation

### Quick start with Docker (recommended)

You need [Docker](https://docs.docker.com/get-docker/) with the Compose plugin.

```bash
git clone https://github.com/AhmedJguirim/WeeBid-Auctions-marketplace.git
cd WeeBid-Auctions-marketplace
scripts/init-env.sh              # creates your private .env (random secrets, git-ignored) and prints the admin login
docker compose up -d --build
```

The first start takes a few minutes. Then open:

- **The app:** http://localhost:18080
- **Admin dashboard:** http://localhost:18000/admin (the admin e-mail and password printed by `init-env.sh`)

The app starts empty (only the admin account exists): add categories and auctions from the dashboard. Optional sample data: `docker compose exec backend php bin/console app:seed-demo --locale=en`.

No secret is ever stored in the repository or in an image: they all live in your private `.env`.

Putting it on a server, updates and backups: see [DOCKER.md](DOCKER.md).

### Manual setup (for development)

Requirements: PHP 8.1, Composer, Node 18+, MariaDB or MySQL.

```bash
# 1. Backend (http://127.0.0.1:8000)
cd backend
composer install
cp .env.example .env             # git-ignored: set DATABASE_URL, APP_SECRET and JWT_PASSPHRASE in it
#   then:
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force
php bin/console lexik:jwt:generate-keypair
php bin/console app:create-admin you@example.com a-strong-password
php bin/console app:seed-demo                # optional sample data (manual)
php -S 127.0.0.1:8000 -t public              # or: symfony server:start

# 2. Real-time server (port 8081)
cd ../socket && npm install
#   notifications are created through a plain member account:
#   (backend) php bin/console app:create-admin socket@weebid.internal <password> --role=ROLE_USER --display-name=weebidsocket
SOCKET_PASSWORD=<password> npm start

# 3. Frontend (http://localhost:3000)
cd .. && npm install --legacy-peer-deps && npm start
```

## Project structure

```
src/        React app (components, redux, i18n/locales)
backend/    Symfony API, entities, admin dashboard
socket/     Socket.io server
docker/     nginx config      scripts/   deployment helpers
```

## Contributing

Contributions, bug reports and ideas are welcome.

1. Fork the repo and create a branch: `git checkout -b feature/my-idea`.
2. Run the app locally (see above) and keep the style of the surrounding code.
3. Make sure `npm run build` passes. Add every new UI text to **both** `src/i18n/locales/fr.json` and `en.json`.
4. Commit with a short, clear message and open a pull request describing what changed and why.

## License

[MIT](LICENSE) © Ahmed Jguirim

## Contact

**Ahmed Jguirim** · jguirimahmed112@gmail.com · [GitHub](https://github.com/AhmedJguirim)
