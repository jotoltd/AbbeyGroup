# The Abbey Group website

Next.js site for The Abbey Group — fine homes and property development in
Norfolk. Includes an admin CMS at `/admin` for listings, developments, site
copy and viewing requests.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The admin area is at `/admin` (set
`ADMIN_PASSWORD` in `.env.local` to enable it outside local development).

## Supabase (persistent store + image uploads)

The site reads data from `src/data/*.json` by default. To make admin edits and
uploads persist in production, point it at Supabase:

1. Create a project at https://supabase.com
2. Run `supabase/setup.sql` once in the project's SQL editor — it creates the
   `site_data`/`site_data_backups` tables, a public `images` storage bucket,
   and seeds the current site data.
3. Set these env vars (locally in `.env.local`, and on your host):

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=   # server only, bypasses RLS
   ```

Without these vars everything falls back to the bundled JSON files, so the
site always works — admin writes just won't persist on read-only hosts.

Admin saves trigger `revalidatePath` so public pages update immediately;
pages also revalidate every 5 minutes as a safety net.

## Contact form email

Set `RESEND_API_KEY`, `CONTACT_TO` and `CONTACT_FROM` (see `.env.example`) to
deliver contact form submissions by email via Resend. Without them the form
falls back to the visitor's email client.
