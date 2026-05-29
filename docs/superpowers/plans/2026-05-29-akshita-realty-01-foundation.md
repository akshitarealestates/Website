# Akshita Realty — Plan 1: Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a deployable, themed Next.js + Supabase app with the full database schema + RLS, working auth (Google + email/password), role-based route gating, and the Editorial-Elegance base layout — the foundation every later plan builds on.

**Architecture:** Next.js App Router monolith on Vercel. Server Components by default; Supabase (Postgres + Auth + Storage + pgvector) accessed via `@supabase/ssr` clients. Authorization enforced by Postgres RLS (backbone) plus middleware route gating (UX). Design system implemented with Tailwind + shadcn/ui themed to the Direction-A palette, Fraunces + Inter via `next/font`.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui, Framer Motion, `@supabase/ssr` + `@supabase/supabase-js`, Vitest + React Testing Library, Vercel.

> **DOCS-FIRST (mandatory):** Next.js, Tailwind, and Supabase SSR APIs shift between versions. Before each task that writes framework code, open the current official docs (nextjs.org/docs/app, supabase.com/docs/guides/auth/server-side/nextjs, tailwindcss.com/docs) and confirm signatures. Code below targets current stable APIs; flagged spots (⚠️) are the ones most likely to have moved.

---

## Execution notes (actual vs. plan)

- **Stack landed on Next.js 16.2.6 + Tailwind v4.** Theme tokens use `@theme` in `globals.css` (no `tailwind.config`).
- **Route gating is `src/proxy.ts` (exports `proxy`), not `middleware.ts`.** Next.js 16 renamed the
  convention; a root `middleware.ts` silently fails to register. Verified against Next 16 docs and the
  build output (`ƒ Proxy (Middleware)`).
- **Supabase provisioning deferred** (org at free-project limit). All code, the schema/RLS migration
  files, and hand-authored `src/types/database.ts` were written; live ops (apply migrations, regenerate
  types, OAuth config, deploy) are captured in [`../../SUPABASE_ACTIVATION.md`](../../SUPABASE_ACTIVATION.md).
  The app builds and runs without env values via graceful guards in the header, `updateSession`, `proxy`,
  dashboard, and the auth form (lazy client creation).
- **Task 13 (`vercel.ts`) skipped intentionally.** Vercel auto-detects Next.js; deployment is documented
  in the activation checklist instead of adding the volatile `@vercel/config` dependency.

## File structure created in this plan

```
package.json, tsconfig.json, next.config.ts, vercel.ts, vitest.config.ts, .env.example
src/
  app/
    layout.tsx                 # root layout: fonts, providers, header/footer
    page.tsx                   # home placeholder (hero in design system)
    globals.css                # Tailwind + theme tokens (palette, radius)
    (auth)/login/page.tsx      # sign-in (Google + email/pw)
    (auth)/signup/page.tsx     # sign-up
    auth/callback/route.ts     # OAuth/code-exchange callback
    auth/signout/route.ts      # sign-out
    dashboard/page.tsx         # gated placeholder
    admin/page.tsx             # gated placeholder
  components/
    layout/site-header.tsx
    layout/site-footer.tsx
    ui/                        # shadcn components land here
  lib/
    supabase/server.ts         # server client
    supabase/client.ts         # browser client
    supabase/middleware.ts     # session refresh helper
    auth/roles.ts              # role types + guards
    format.ts                  # INR/area formatting
    utils.ts                   # cn()
  types/database.ts            # generated Supabase types
  test/setup.ts
middleware.ts                  # (or proxy.ts on Next 16) route gating + session
supabase/
  migrations/0001_init.sql     # schema + extensions + indexes
  migrations/0002_rls.sql      # RLS policies + profile trigger + storage
  seed/.gitkeep                # seed scripts arrive in Plan 2
```

---

### Task 1: Scaffold the Next.js app

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/*`, `src/app/globals.css`

- [ ] **Step 1: Scaffold into the current (non-empty) repo directory**

The repo already has `README.md`, `.gitignore`, and `docs/`. Scaffold into a temp dir and move files in to avoid the non-empty-dir prompt.

Run:
```bash
cd /home/pratap/work/Akshita_Realestate_website
npx create-next-app@latest .akshita-tmp \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --no-turbopack --yes
# move generated files (incl. dotfiles) into repo root, then clean up
shopt -s dotglob
cp -rn .akshita-tmp/* .
rm -rf .akshita-tmp
shopt -u dotglob
```
⚠️ If `create-next-app` flags differ in the installed version, run `npx create-next-app@latest --help` and match: TypeScript, Tailwind, ESLint, App Router, `src/`, import alias `@/*`. Keep `.gitignore` already in repo (merge, don't clobber the `.superpowers/` line).

- [ ] **Step 2: Verify it builds and runs**

Run:
```bash
npm run build
```
Expected: build completes with no errors; a default route is generated.

- [ ] **Step 3: Verify dev server boots**

Run:
```bash
timeout 20 npm run dev || true
```
Expected: logs show "Ready" / local URL before timeout kills it. No crash.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app router project"
```

---

### Task 2: Testing setup (Vitest + RTL)

**Files:**
- Create: `vitest.config.ts`, `src/test/setup.ts`
- Modify: `package.json` (scripts), `tsconfig.json` (vitest globals types)

- [ ] **Step 1: Install dev dependencies**

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
```

- [ ] **Step 3: Create `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Add scripts to `package.json`**

Add to the `"scripts"` object:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Add a smoke test and run it**

Create `src/test/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
describe('test harness', () => {
  it('runs', () => { expect(1 + 1).toBe(2); });
});
```
Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "test: add vitest + react testing library setup"
```

---

### Task 3: INR + area formatting utils (TDD)

**Files:**
- Create: `src/lib/format.ts`, `src/lib/format.test.ts`

- [ ] **Step 1: Write the failing tests**

`src/lib/format.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { formatINR, formatArea } from './format';

describe('formatINR', () => {
  it('formats crores', () => {
    expect(formatINR(14000000)).toBe('₹1.4 Cr');
    expect(formatINR(32000000)).toBe('₹3.2 Cr');
    expect(formatINR(12500000)).toBe('₹1.25 Cr');
  });
  it('formats lakhs', () => {
    expect(formatINR(7800000)).toBe('₹78 L');
    expect(formatINR(9500000)).toBe('₹95 L');
  });
  it('formats small amounts with Indian grouping', () => {
    expect(formatINR(50000)).toBe('₹50,000');
  });
});

describe('formatArea', () => {
  it('formats sqft', () => {
    expect(formatArea(1250)).toBe('1,250 sq ft');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- format`
Expected: FAIL — `formatINR is not a function` (module not found).

- [ ] **Step 3: Implement `src/lib/format.ts`**

```ts
const CRORE = 1_00_00_000;
const LAKH = 1_00_000;

function trimNumber(n: number): string {
  return parseFloat(n.toFixed(2)).toString();
}

/** Format a rupee amount using Indian crore/lakh conventions. */
export function formatINR(amount: number): string {
  if (amount >= CRORE) return `₹${trimNumber(amount / CRORE)} Cr`;
  if (amount >= LAKH) return `₹${trimNumber(amount / LAKH)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Format an area value in square feet. */
export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString('en-IN')} sq ft`;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- format`
Expected: all formatting tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add INR + area formatting utils with tests"
```

---

### Task 4: Role types + guards (TDD)

**Files:**
- Create: `src/lib/auth/roles.ts`, `src/lib/auth/roles.test.ts`

- [ ] **Step 1: Write the failing tests**

`src/lib/auth/roles.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { isAdmin, canSell, type Role } from './roles';

describe('role guards', () => {
  it('isAdmin only true for admin', () => {
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('seller')).toBe(false);
    expect(isAdmin('buyer')).toBe(false);
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });
  it('canSell true for seller and admin', () => {
    const cases: [Role | null | undefined, boolean][] = [
      ['seller', true], ['admin', true], ['buyer', false], [null, false],
    ];
    for (const [role, expected] of cases) expect(canSell(role)).toBe(expected);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- roles`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/auth/roles.ts`**

```ts
export type Role = 'buyer' | 'seller' | 'admin';

export function isAdmin(role: Role | null | undefined): boolean {
  return role === 'admin';
}

export function canSell(role: Role | null | undefined): boolean {
  return role === 'seller' || role === 'admin';
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- roles`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add role types and guards with tests"
```

---

### Task 5: Provision Supabase + env scaffolding

**Files:**
- Create: `.env.example`, `.env.local` (gitignored), `supabase/migrations/`, `supabase/seed/.gitkeep`

- [ ] **Step 1: Create or link a Supabase project**

Use the Supabase MCP tools available in this session (`create_project` / `list_projects` / `get_project_url` / `get_publishable_keys`) OR the dashboard. Record: Project URL, publishable (anon) key, secret (service-role) key. ⚠️ Supabase now labels keys "publishable"/"secret"; the legacy `anon`/`service_role` keys still work and are interchangeable here.

- [ ] **Step 2: Install Supabase libs + CLI**

```bash
npm i @supabase/supabase-js @supabase/ssr
npm i -D supabase
npx supabase init   # creates supabase/ config; keep migrations dir
```
If `supabase init` asks to overwrite, keep existing `supabase/migrations`.

- [ ] **Step 3: Create `.env.example`**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 4: Create `.env.local` with real values**

Copy `.env.example` to `.env.local` and fill the three Supabase values from Step 1. Confirm `.env*.local` is gitignored (it is, from the root `.gitignore`).

- [ ] **Step 5: Commit (no secrets)**

```bash
git add .env.example supabase package.json package-lock.json
git commit -m "chore: add supabase libs, cli, and env scaffolding"
```

---

### Task 6: Database schema migration

**Files:**
- Create: `supabase/migrations/0001_init.sql`

- [ ] **Step 1: Write the schema migration**

`supabase/migrations/0001_init.sql`:
```sql
-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- Enums
create type user_role as enum ('buyer', 'seller', 'admin');
create type property_category as enum ('commercial', 'resell', 'premium_project');
create type listing_type as enum ('sale', 'rent');
create type property_status as enum ('draft', 'pending', 'published', 'sold', 'rejected');
create type property_source as enum ('admin', 'user');
create type lead_channel as enum ('enquiry_form', 'chatbot', 'valuation', 'whatsapp', 'contact');
create type lead_status as enum ('new', 'contacted', 'closed');
create type post_status as enum ('draft', 'published');

-- Profiles (1:1 with auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'buyer',
  created_at timestamptz not null default now()
);

-- Localities
create table localities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text not null default 'Lucknow',
  slug text unique not null,
  description text,
  ai_insights text,
  avg_price_per_sqft integer,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

-- Properties
create table properties (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  category property_category not null,
  listing_type listing_type not null default 'sale',
  price bigint not null,
  price_period text,                 -- e.g. 'month' for rent
  bhk smallint,
  bedrooms smallint,
  bathrooms smallint,
  carpet_area_sqft integer,
  builtup_area_sqft integer,
  furnishing text,
  floor smallint,
  total_floors smallint,
  city text not null default 'Lucknow',
  locality_id uuid references localities(id) on delete set null,
  address text,
  latitude double precision,
  longitude double precision,
  amenities text[] not null default '{}',
  rera_id text,
  description text,
  highlights text[] not null default '{}',
  status property_status not null default 'draft',
  rejection_reason text,
  source property_source not null default 'admin',
  owner_id uuid references profiles(id) on delete set null,
  is_featured boolean not null default false,
  embedding vector(1536),            -- ⚠️ dims must match embedding model (Plan 4)
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index properties_status_idx on properties(status);
create index properties_category_idx on properties(category);
create index properties_city_locality_idx on properties(city, locality_id);
create index properties_featured_idx on properties(is_featured) where is_featured;

-- Property images
create table property_images (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  alt text,
  sort_order smallint not null default 0,
  is_cover boolean not null default false
);
create index property_images_property_idx on property_images(property_id);

-- Premium project extras
create table project_details (
  property_id uuid primary key references properties(id) on delete cascade,
  developer_name text,
  possession_date date,
  configurations jsonb not null default '[]',
  brochure_path text,
  total_units integer,
  project_status text,
  amenities_extended text[] not null default '{}'
);

-- Leads
create table leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  message text,
  property_id uuid references properties(id) on delete set null,
  source_channel lead_channel not null default 'enquiry_form',
  status lead_status not null default 'new',
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index leads_status_idx on leads(status);

-- Valuations (also recorded as a lead)
create table valuations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  locality_id uuid references localities(id) on delete set null,
  area_sqft integer,
  bhk smallint,
  property_type text,
  estimated_low bigint,
  estimated_high bigint,
  created_at timestamptz not null default now()
);

-- Favorites
create table favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

-- Saved searches
create table saved_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  label text,
  filters jsonb not null default '{}',
  notify boolean not null default false,
  created_at timestamptz not null default now()
);

-- Concierge chat
create table chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null,               -- 'user' | 'assistant' | 'tool'
  content text not null,
  created_at timestamptz not null default now()
);

-- Blog
create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  cover_path text,
  excerpt text,
  body text,
  author text,
  status post_status not null default 'draft',
  published_at timestamptz,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- updated_at trigger for properties
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger properties_set_updated_at
  before update on properties
  for each row execute function set_updated_at();
```

- [ ] **Step 2: Apply the migration**

Use the Supabase MCP `apply_migration` tool with this file's contents (name `0001_init`), OR:
```bash
npx supabase db push
```
⚠️ `db push` requires the project to be linked (`npx supabase link --project-ref <ref>`). Prefer the MCP `apply_migration` tool if linking is not set up.

- [ ] **Step 3: Verify tables exist**

Use MCP `list_tables` (schema `public`) OR run via MCP `execute_sql`:
```sql
select table_name from information_schema.tables where table_schema='public' order by 1;
```
Expected: all tables above are listed.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0001_init.sql
git commit -m "feat: add database schema migration"
```

---

### Task 7: RLS policies, profile trigger, storage

**Files:**
- Create: `supabase/migrations/0002_rls.sql`

- [ ] **Step 1: Write the RLS migration**

`supabase/migrations/0002_rls.sql`:
```sql
-- Admin check helper (SECURITY DEFINER avoids RLS recursion on profiles)
create or replace function public.is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Auto-create a profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table profiles        enable row level security;
alter table localities      enable row level security;
alter table properties      enable row level security;
alter table property_images enable row level security;
alter table project_details enable row level security;
alter table leads           enable row level security;
alter table valuations      enable row level security;
alter table favorites       enable row level security;
alter table saved_searches  enable row level security;
alter table chat_sessions   enable row level security;
alter table chat_messages   enable row level security;
alter table blog_posts      enable row level security;

-- profiles
create policy "profiles self read"  on profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles self update" on profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));
create policy "profiles admin all" on profiles for all using (public.is_admin()) with check (public.is_admin());

-- localities (public read, admin write)
create policy "localities public read" on localities for select using (true);
create policy "localities admin write" on localities for all using (public.is_admin()) with check (public.is_admin());

-- properties
create policy "properties public read" on properties for select
  using (status = 'published' or owner_id = auth.uid() or public.is_admin());
create policy "properties seller insert" on properties for insert
  with check (auth.uid() = owner_id and category = 'resell' and source = 'user');
create policy "properties seller update" on properties for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid() and category = 'resell');
create policy "properties admin all" on properties for all
  using (public.is_admin()) with check (public.is_admin());

-- property_images (gated by parent visibility)
create policy "images read" on property_images for select using (
  exists (select 1 from properties p where p.id = property_id
          and (p.status = 'published' or p.owner_id = auth.uid() or public.is_admin())));
create policy "images owner write" on property_images for all using (
  exists (select 1 from properties p where p.id = property_id
          and (p.owner_id = auth.uid() or public.is_admin())))
  with check (
  exists (select 1 from properties p where p.id = property_id
          and (p.owner_id = auth.uid() or public.is_admin())));

-- project_details (gated by parent)
create policy "project read" on project_details for select using (
  exists (select 1 from properties p where p.id = property_id
          and (p.status = 'published' or public.is_admin())));
create policy "project admin write" on project_details for all using (public.is_admin()) with check (public.is_admin());

-- leads + valuations: anyone may insert; only admin reads/updates
create policy "leads public insert" on leads for insert with check (true);
create policy "leads admin manage" on leads for all using (public.is_admin()) with check (public.is_admin());
create policy "valuations public insert" on valuations for insert with check (true);
create policy "valuations admin manage" on valuations for all using (public.is_admin()) with check (public.is_admin());

-- favorites / saved_searches: owner only
create policy "favorites owner" on favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "saved owner" on saved_searches for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- chat: owner (or anon session with null user via service role only)
create policy "chat sessions owner" on chat_sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "chat messages owner" on chat_messages for all using (
  exists (select 1 from chat_sessions s where s.id = session_id and s.user_id = auth.uid()))
  with check (
  exists (select 1 from chat_sessions s where s.id = session_id and s.user_id = auth.uid()));

-- blog
create policy "blog public read" on blog_posts for select using (status = 'published' or public.is_admin());
create policy "blog admin write" on blog_posts for all using (public.is_admin()) with check (public.is_admin());

-- Storage bucket for property images
insert into storage.buckets (id, name, public) values ('property-images', 'property-images', true)
  on conflict (id) do nothing;
create policy "property images public read" on storage.objects for select
  using (bucket_id = 'property-images');
create policy "property images auth write" on storage.objects for insert
  with check (bucket_id = 'property-images' and auth.role() = 'authenticated');
create policy "property images auth update" on storage.objects for update
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');
create policy "property images auth delete" on storage.objects for delete
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');
```

- [ ] **Step 2: Apply the migration**

Apply via MCP `apply_migration` (name `0002_rls`) or `npx supabase db push`.

- [ ] **Step 3: Verify RLS with the security advisor**

Use MCP `get_advisors` (type `security`).
Expected: no "RLS disabled on public table" findings for the tables above. Fix any flagged table by enabling RLS.

- [ ] **Step 4: Verify public cannot read drafts (manual SQL check)**

Via MCP `execute_sql` (runs as service role, so test the policy logic by reasoning) — then confirm in app during Task 12. Insert a draft property and confirm anon SELECT returns 0 rows once the app client is wired.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/0002_rls.sql
git commit -m "feat: add RLS policies, profile trigger, storage bucket"
```

---

### Task 8: Supabase client utilities + generated types

**Files:**
- Create: `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/middleware.ts`, `src/types/database.ts`

- [ ] **Step 1: Generate TypeScript types**

Use MCP `generate_typescript_types` and save output to `src/types/database.ts`, OR:
```bash
npx supabase gen types typescript --linked > src/types/database.ts
```

- [ ] **Step 2: Create the browser client `src/lib/supabase/client.ts`**

```ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 3: Create the server client `src/lib/supabase/server.ts`**

⚠️ `cookies()` is async in current Next.js — confirm in docs. Code below awaits it.
```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options));
          } catch {
            // called from a Server Component — safe to ignore; middleware refreshes
          }
        },
      },
    },
  );
}
```

- [ ] **Step 4: Create the session-refresh helper `src/lib/supabase/middleware.ts`**

```ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  return { response, user, supabase };
}
```

- [ ] **Step 5: Verify type-check passes**

Run: `npx tsc --noEmit`
Expected: no errors (types resolve, `Database` imported).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add supabase client utilities and generated types"
```

---

### Task 9: Route gating middleware

**Files:**
- Create: `middleware.ts` (repo root)

- [ ] **Step 1: Create the middleware**

⚠️ On **Next.js 16** this file must be named `proxy.ts` and export `proxy`; on **15.x** it is `middleware.ts` exporting `middleware`. Check the installed `next` version (`npm ls next`) and name accordingly. Content is identical otherwise.

`middleware.ts`:
```ts
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const needsAuth = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/sell');
  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: compiles; middleware registered with no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add auth + admin route gating middleware"
```

---

### Task 10: Design system — fonts, theme tokens, base UI

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
npx shadcn@latest add button input label card dropdown-menu sheet badge
```
Accept defaults; this creates `src/lib/utils.ts` (with `cn`) and `src/components/ui/*`. ⚠️ If `init` already created `src/lib/utils.ts`, do not duplicate.

- [ ] **Step 2: Install Framer Motion**

```bash
npm i framer-motion
```

- [ ] **Step 3: Define theme tokens in `src/app/globals.css`**

Add the Direction-A palette as CSS variables (merge into the existing `:root`/`@theme` block created by Tailwind/shadcn — ⚠️ Tailwind v4 uses `@theme`; v3 uses `tailwind.config`. Match the installed setup):
```css
:root {
  --color-ink: #15202B;
  --color-sky: #AEBFD1;
  --color-cream: #F6F4EF;
  --color-gold: #C89B3C;
  --radius: 1rem;
}
body { background: var(--color-cream); color: var(--color-ink); }
```
Expose them to Tailwind utilities (`bg-ink`, `text-gold`, etc.) per the installed Tailwind version's theme mechanism.

- [ ] **Step 4: Load fonts + render layout in `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'Akshita Realty — Premium Real Estate in Lucknow',
  description: 'Curated commercial, resell, and premium projects in Lucknow.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: compiles (header/footer created next; if build runs before Task 11, temporarily stub the imports — but execute Task 11 first if doing strict order).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add design system fonts, theme tokens, base ui"
```

---

### Task 11: Header, footer, home placeholder

**Files:**
- Create: `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/layout/site-header.tsx`**

```tsx
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

const NAV = [
  { href: '/properties?category=commercial', label: 'Commercial' },
  { href: '/properties?category=resell', label: 'Resell' },
  { href: '/properties?category=premium_project', label: 'Premium Projects' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-[var(--color-cream)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
          Akshita <span className="italic font-normal">Realty</span>
        </Link>
        <nav className="hidden gap-7 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-ink/80 hover:text-ink">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="text-sm">Dashboard</Link>
          ) : (
            <Link href="/login" className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm text-white">Log in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create `src/components/layout/site-footer.tsx`**

```tsx
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-[var(--color-ink)] text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-4 text-white/80">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg text-white">Akshita Realty</p>
          <p className="mt-2 text-sm">Premium real estate in Lucknow.</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-white">Explore</p>
          <ul className="space-y-2">
            <li><Link href="/properties?category=commercial">Commercial</Link></li>
            <li><Link href="/properties?category=resell">Resell</Link></li>
            <li><Link href="/properties?category=premium_project">Premium Projects</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-white">Company</p>
          <ul className="space-y-2">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/insights">Insights</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-white">Sell with us</p>
          <ul className="space-y-2"><li><Link href="/sell">List your property</Link></li></ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Akshita Realty. All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Replace `src/app/page.tsx` with a themed hero placeholder**

```tsx
export default function Home() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Lucknow · Premium Real Estate</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.05] md:text-7xl">
        Redefining<br /><span className="italic font-normal">modern living</span>
      </h1>
      <p className="mt-6 max-w-xl text-ink/70">
        Browse a curated collection of commercial spaces, resale homes, and premium projects across Lucknow.
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Verify build + dev render**

Run: `npm run build && timeout 20 npm run dev || true`
Expected: build passes; dev server renders home with header/footer (visually confirm at localhost:3000).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add site header, footer, and themed home placeholder"
```

---

### Task 12: Auth pages, callback, sign-out, gated placeholders

**Files:**
- Create: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`, `src/app/auth/callback/route.ts`, `src/app/auth/signout/route.ts`, `src/app/dashboard/page.tsx`, `src/app/admin/page.tsx`
- Create: `src/components/auth/auth-form.tsx`

- [ ] **Step 1: Create the auth form (client) `src/components/auth/auth-form.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const supabase = createClient();
  const router = useRouter();
  const next = useSearchParams().get('next') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function google() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }

  async function emailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const fn = mode === 'login' ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push(next); router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm space-y-5">
      <button onClick={google} className="w-full rounded-full border border-black/10 bg-white py-2.5 text-sm font-medium">
        Continue with Google
      </button>
      <div className="text-center text-xs text-ink/40">or</div>
      <form onSubmit={emailSubmit} className="space-y-3">
        <input className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" type="email"
          placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" type="password"
          placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-[var(--color-ink)] py-2.5 text-sm text-white disabled:opacity-60">
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Create login + signup pages**

`src/app/(auth)/login/page.tsx`:
```tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="mb-8 text-center font-[family-name:var(--font-display)] text-4xl">Welcome back</h1>
      <Suspense><AuthForm mode="login" /></Suspense>
      <p className="mt-6 text-center text-sm text-ink/60">
        New here? <Link href="/signup" className="underline">Create an account</Link>
      </p>
    </section>
  );
}
```

`src/app/(auth)/signup/page.tsx`:
```tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function SignupPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="mb-8 text-center font-[family-name:var(--font-display)] text-4xl">Create your account</h1>
      <Suspense><AuthForm mode="signup" /></Suspense>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account? <Link href="/login" className="underline">Log in</Link>
      </p>
    </section>
  );
}
```

- [ ] **Step 3: Create the OAuth callback `src/app/auth/callback/route.ts`**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
```

- [ ] **Step 4: Create sign-out `src/app/auth/signout/route.ts`**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${new URL(request.url).origin}/`, { status: 303 });
}
```

- [ ] **Step 5: Create gated placeholders**

`src/app/dashboard/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Your dashboard</h1>
      <p className="mt-3 text-ink/70">Signed in as {user?.email}</p>
      <form action="/auth/signout" method="post" className="mt-6">
        <button className="rounded-full border border-black/10 px-4 py-2 text-sm">Sign out</button>
      </form>
    </section>
  );
}
```

`src/app/admin/page.tsx`:
```tsx
export default function AdminHome() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Admin</h1>
      <p className="mt-3 text-ink/70">Admin tools arrive in Plan 3.</p>
    </section>
  );
}
```

- [ ] **Step 6: Configure Google OAuth + redirect URLs**

In Supabase dashboard → Authentication → Providers → enable Google (add Google OAuth client ID/secret). Add redirect URL `http://localhost:3000/auth/callback` and the production URL. ⚠️ Without provider credentials the Google button errors — email/password still works for testing.

- [ ] **Step 7: Verify the full auth flow**

Run: `timeout 30 npm run dev || true` then manually:
- Visit `/dashboard` while logged out → redirected to `/login`.
- Sign up with email/password at `/signup` → lands on `/dashboard` showing the email.
- Confirm a row appears in `profiles` (MCP `execute_sql`: `select id, role from profiles;`) with `role='buyer'`.
- Visit `/admin` as a buyer → redirected to `/`.
- Promote yourself (MCP `execute_sql`: `update profiles set role='admin' where id='<your-id>';`) → `/admin` now loads.
Expected: all behaviors as described.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add auth pages, callback, signout, gated routes"
```

---

### Task 13: Vercel config + deploy

**Files:**
- Create: `vercel.ts`

- [ ] **Step 1: Create `vercel.ts`**

⚠️ Confirm `@vercel/config` API in current docs before relying on it; a plain `vercel.json` is an acceptable fallback.
```bash
npm i -D @vercel/config
```
```ts
import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'nextjs',
  buildCommand: 'npm run build',
};
```

- [ ] **Step 2: Set environment variables on Vercel**

```bash
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_SITE_URL production
```
(Repeat for `preview`/`development` as needed, or use the `vercel:env` skill.)

- [ ] **Step 3: Deploy a preview**

```bash
vercel deploy
```
Expected: build succeeds; preview URL returned. Visit it: home, login, and email/password signup work against Supabase. Add the preview URL to Supabase Auth redirect URLs if testing OAuth there.

- [ ] **Step 4: Final verification**

Run:
```bash
npm run build && npx tsc --noEmit && npm test
```
Expected: build passes, no type errors, all tests green.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: add vercel config and deploy foundation"
```

---

## Self-review against spec

- **Visual system (§3):** Tasks 10–11 implement Fraunces+Inter, palette tokens, header/footer/home. ✅
- **Architecture (§4):** Next App Router monolith, Supabase SSR clients, RLS, middleware gating, Vercel. ✅ (AI Gateway/AI SDK deferred to Plan 4 by design.)
- **Data model (§5):** Task 6 creates every table in the spec; Task 7 every RLS rule + profile trigger + storage. ✅
- **Auth (§4):** Task 12 implements Google + email/password, callback, signout, role gating. ✅
- **Multi-city (§11):** `city` columns + indexes present (Task 6). ✅
- **Deferred to later plans (by design):** catalog/detail/seed (Plan 2), resell/dashboard/admin/leads (Plan 3), AI suite (Plan 4), blog/SEO (Plan 5). The `chat_*`, `leads`, `blog_posts`, `embedding` structures are created now so later plans only add behavior. ✅
- **Placeholder scan:** no TBD/TODO; every code step contains full code. ✅
- **Type consistency:** `createClient()` naming consistent across server/client/middleware; `Role`/`isAdmin`/`canSell` consistent; `Database` type used everywhere. ✅
```
