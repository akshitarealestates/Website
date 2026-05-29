# Supabase + Vercel Activation Checklist

The foundation app is built to **run and build without a live database**. These are the one-time
steps to "activate" it once you have a Supabase project. Do them in order.

## 1. Create the Supabase project
- The org `codesstellar@gmail.com's Org` is at the free-tier limit (2 active projects). Free up a
  slot (pause an unused project) or upgrade to Pro, then create a project named **`Akshita-Realty`**
  in region **`ap-south-1`** (Mumbai — closest to Lucknow).
- Or use any Supabase project you control.

## 2. Apply the database migrations
The schema + RLS live in `supabase/migrations/`. Apply both, in order:

**Option A — Supabase CLI (link + push):**
```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push     # applies 0001_init.sql then 0002_rls.sql
```
**Option B — MCP / dashboard:** run `0001_init.sql` then `0002_rls.sql` via the SQL editor or the
Supabase MCP `apply_migration` tool.

Verify: 12 tables exist in `public`; the security advisor reports no "RLS disabled" findings.

## 3. Regenerate database types (replaces the hand-authored file)
```bash
npx supabase gen types typescript --linked > src/types/database.ts
```
`src/types/database.ts` is currently hand-authored from the schema (see its header comment).
Regenerating guarantees it matches the live DB exactly. Then `npx tsc --noEmit` to confirm.

## 4. Fill environment variables
Copy the values from Supabase → Project Settings → API into `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...        # publishable / anon key
SUPABASE_SERVICE_ROLE_KEY=...            # secret / service-role key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Restart `npm run dev`. The header will now show real auth state; `/login` shows the real form.

## 5. Enable Google OAuth
- Supabase Dashboard → Authentication → Providers → **Google**: add your Google OAuth client ID + secret.
- Add Redirect URLs: `http://localhost:3000/auth/callback` and your production URL
  `https://<your-domain>/auth/callback`.
- Email/password works without this; Google needs it.

## 6. Create the first admin
After signing up once (a `profiles` row is auto-created with `role='buyer'`), promote yourself:
```sql
update profiles set role = 'admin' where id = '<your-user-id>';
```
(Find the id with `select id, role from profiles;`.)

## 7. Deploy to Vercel
Vercel auto-detects Next.js — no `vercel.json`/`vercel.ts` required.
```bash
vercel link
# add the four env vars to each environment you use:
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_SITE_URL production    # set to the production URL
vercel deploy            # preview
vercel deploy --prod     # production
```
Add the Vercel preview/production URLs to Supabase Auth redirect URLs (step 5) for OAuth there.

## 8. Smoke-test the activated app
- Visit `/dashboard` logged out → redirected to `/login`.
- Sign up (email/password) → lands on `/dashboard`; a `profiles` row appears with `role='buyer'`.
- Visit `/admin` as a buyer → redirected to `/`. Promote to admin (step 6) → `/admin` loads.
- Public cannot read a `draft`/`pending` property (RLS): confirm via an anon client query returns 0 rows.

Once activated, proceed to **Plan 2 (Catalog & Detail)** in `docs/superpowers/plans/`.
