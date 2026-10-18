# Domain Registration Portal — Reporting Admin

Responsive React dashboard backed by a Laravel 12 JSON API. The pages follow the supplied requirements: domain reporting and filters, status cards, ministry/state/category charts, nodal officer lists, and exports. The interface uses a restrained Government of India portal palette and accessibility controls. It does not reproduce an official emblem.

## Local setup (no Docker)

Requirements: PHP 8.2+, Composer, Node.js 20.19+ and npm. Use MySQL 8+ for a shared or production database; SQLite is available for an isolated local preview.

1. Configure the Laravel API in `backend/.env`. The scaffold creates this file on setup; otherwise copy `.env.example` to `.env`. To use MySQL, set `DB_CONNECTION=mysql`, database host, database name, user, and password. Keep the generated `APP_KEY` private.
2. Set `PORTAL_ADMIN_NAME`, `PORTAL_ADMIN_EMAIL`, and a strong `PORTAL_ADMIN_PASSWORD` in `backend/.env`. This only provisions an administrator when the seeder runs.
3. From `backend/`, run `composer install`, `php artisan migrate --seed`, then `php artisan serve --host=127.0.0.1 --port=8000`.
4. In another terminal, from the project root, run `npm install` and `npm run dev`. Vite proxies `/api` requests to the local Laravel server.
5. Sign in with the seeded email and password. API bearer tokens expire after 60 minutes.

Add authorised records to the `domains` table before expecting dashboard counts. The repository intentionally does not seed fictitious government domain records. The table migration documents the report fields.

## API

- `POST /api/login`, `POST /api/logout`, `GET /api/user`
- `GET /api/reports`, `POST /api/reports/search`, `GET /api/reports/nodal-officer`, `GET /api/reports/options`
- `GET /api/reports/summary`, `GET /api/reports/export/csv`

Report endpoints require Sanctum authentication and a permitted portal role. Filters are validated, sort fields are allow-listed, SQL values are parameterized, and report results are paginated by the API in 100-row batches. The report table's global search runs against the API. Excel, CSV, and PDF downloads are generated in the browser; export controls remain disabled until all matching batches are loaded.

## Notes for deployment

Replace the local account provisioning with the authorised NIC identity/SSO service and apply the department's role matrix before production. Configure HTTPS, secure cookie/session policy, CORS, database credentials, backups, and audit retention for the deployment environment. The local administrator account and browser preferences are for development only; no live NIC identity or domain data is included.
# DomainReports
