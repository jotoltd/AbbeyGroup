# The Abbey Group website

Next.js site for The Abbey Group — fine homes and property development in
Norfolk. Includes an admin CMS at `/admin` for listings, developments, site
copy, viewing requests, contact enquiries and admin users. Viewing requests
and enquiries can be tracked through statuses with notes, CMS-uploaded images
can be deleted (with a usage check), and the **Activity** tab records an audit
log of admin actions.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The admin area is at `/admin`.

## Admin sign-in

Admin accounts are managed in the **Users** tab of `/admin` and stored
scrypt-hashed in the data store. Sign-in issues a 7-day session token signed
with `AUTH_SECRET` (or `SUPABASE_SERVICE_ROLE_KEY` when unset). Removing a
user revokes their access immediately.

`ADMIN_PASSWORD` is a recovery credential: sign in with any username plus that
password to regain access and create a fresh account. Locally, with neither
users nor `ADMIN_PASSWORD` configured, any credentials will sign you in so you
can create the first account.

## Supabase (persistent store + image uploads)

Site data lives as JSON documents in a private `data` storage bucket, and
admin image uploads go to a public `images` bucket — both already provisioned
and seeded. Set these env vars (locally in `.env.local`, and on your host):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server only, bypasses storage RLS
```

Without these vars everything falls back to the bundled `src/data/*.json`
files, so the site always works — admin writes just won't persist on
read-only hosts. Each admin save also keeps a timestamped copy under
`backups/` in the bucket (or `src/data/backups/` locally).

Admin saves trigger `revalidatePath` so public pages update immediately;
pages also revalidate every 5 minutes as a safety net.

## Contact form email

Set `RESEND_API_KEY`, `CONTACT_TO` and `CONTACT_FROM` (see `.env.example`) to
deliver contact form submissions by email via Resend. Submissions are also
stored and viewable in the admin **Enquiries** tab regardless; without Resend
the form additionally falls back to the visitor's email client.
