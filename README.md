# Domain Reports

React dashboard with a Laravel API and MySQL database.

## Run locally

Requirements: PHP 8.2+ with `pdo_mysql`, Composer, MySQL, and Node.js with npm.

1. Start MySQL and create a database named `nic_domain_reports`.
2. In `backend/`, copy `.env.example` to `.env`. Set `DB_USERNAME`, `DB_PASSWORD`, and a strong `PORTAL_ADMIN_PASSWORD`.
3. In `backend/`, run:

   ```sh
   composer install
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve --host=127.0.0.1 --port=8001
   ```

4. In another terminal, from the project root, run `npm install` then `npm run dev`.

The seeded login uses `PORTAL_ADMIN_EMAIL` and `PORTAL_ADMIN_PASSWORD` from `backend/.env`. Add authorised records to the `domains` table for report data. Never commit `.env` or real credentials.
# DomainReports
