# Database setup & connection

Quick steps to wire the provided SQL schema into this project (Laravel API + React front-end):

1) Import the provided SQL into your database (Postgres recommended since SQL file uses double-quoted identifiers):

   psql -U <user> -d <database> -f "query sql simpeg_kaltim.txt"

   Example on Windows PowerShell (from workspace root):

   psql -h 127.0.0.1 -p 5432 -U postgres -d simpeg_kaltim -f "query sql simpeg_kaltim.txt"

   If database is not created yet:

   createdb -h 127.0.0.1 -p 5432 -U postgres simpeg_kaltim

2) Configure Laravel DB connection: copy `api/.env.example` to `api/.env` and set the `DB_` values, for example:

   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=your_db
   DB_USERNAME=your_user
   DB_PASSWORD=your_pass

3) If you prefer to use Laravel migrations instead of importing SQL, run (from `api/`):

   php artisan migrate
   php artisan storage:link

   Note: migrations were added under `api/database/migrations` and create the tables present in the SQL.

4) Start backend and frontend:

    - Backend (Laravel):

     cd api
       php -S 127.0.0.1:9012 -t public

       Note: if `php artisan serve` shows `Failed to listen on 127.0.0.1:800x`, use `php -S` as above or run via Herd.

    - Backend with Herd (alternative):

       - Start Herd Desktop app first.
       - Add/Link site to `SIMPEG/api` folder.
       - Open generated `*.test` domain from Herd.

   - Frontend (React):

     cd react
       copy .env.example .env  # if not exists, optional
     npm install
     npm run dev

       Note: React Vite proxy uses `VITE_API_TARGET` (default `http://127.0.0.1:9012`).

5) Frontend component: include `react/components/pegawai/PegawaiList.tsx` on any page to show the list. It fetches `/api/pegawai`.

If you want, I can run and test migrations or wire a seed importer next.
