# Akshita Realty — Plan 3: Demo Auth, Dashboard, Resell Wizard, Admin Panel

> REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** A demo-auth layer (bypass flag so admin/dashboard are previewable without login), a user dashboard, a resell listing wizard, and the full **admin panel** (properties CRUD, moderation queue, leads pipeline, blog editor, localities manager) — all backed by the in-memory repo with mutations that persist while the dev server runs.

**Architecture:** A single `getCurrentUser()` session helper returns a demo admin when `NEXT_PUBLIC_DEMO_AUTH=true`, else the real Supabase user + profile role. The repo gains in-memory mutation functions over mutable stores. Admin/dashboard pages are Server Components; forms use Server Actions + client islands. Image fields use URL inputs (no Storage upload until DB migration).

**Tech Stack:** Next.js 16 App Router, Server Actions, shadcn/ui, Tailwind v4.

> **Demo reality:** Supabase IS linked now, but data stays mock per the chosen "mock now, migrate later" path. Admin edits mutate in-memory stores (reset on server restart) — expected for the placeholder phase.

---

## Group 3.1 — Demo-auth + repo mutations + demo banner
- `.env.local` + `.env.example`: add `NEXT_PUBLIC_DEMO_AUTH=true` (documented: "preview admin/dashboard without login; set false to use real Supabase auth").
- `src/lib/auth/session.ts`:
  ```ts
  export interface SessionUser { id: string; email: string; fullName: string; role: 'buyer'|'seller'|'admin'; isDemo: boolean }
  export async function getCurrentUser(): Promise<SessionUser | null>
  ```
  When `process.env.NEXT_PUBLIC_DEMO_AUTH === 'true'` → return `{ id:'demo-admin', email:'demo@akshita.test', fullName:'Demo Admin', role:'admin', isDemo:true }`. Else: use the Supabase server client to fetch the user and their `profiles.role` (guard missing env → null).
- `src/proxy.ts`: when demo flag is `true`, skip auth/role redirects entirely (allow all). Else keep current gating.
- `src/components/layout/demo-banner.tsx`: a thin top banner ("Demo mode — exploring with sample data. Connect real auth by setting NEXT_PUBLIC_DEMO_AUTH=false.") rendered in the root layout only when demo flag is on.
- Update `SiteHeader` to use `getCurrentUser()` (show Dashboard + Admin links when role admin; Log in otherwise).
- Repo mutations in `src/lib/data/repo.ts` (mutable stores for properties[already], blog, localities, leads):
  `listAllProperties(filters?)`, `createProperty(input)`, `updateProperty(slug, patch)`, `deleteProperty(slug)`, `setPropertyStatus(slug,status,rejectionReason?)`, `listPendingProperties()`, `listMyListings(ownerId)`, `listLeads()`, `updateLeadStatus(id,status)`, `listAllBlogPosts()`, `createBlogPost(input)`, `updateBlogPost(slug,patch)`, `deleteBlogPost(slug)`, `createLocality/updateLocality/deleteLocality`. Slugs auto-generated from titles (dedupe with a counter). Add unit tests for create/update/status-transition/delete.
- Acceptance: with flag on, `/admin` and `/dashboard` load without redirect; header shows Admin link; repo mutation tests pass; build green.

## Group 3.2 — User dashboard + Resell sell-wizard
- `src/app/dashboard/page.tsx` (uses `getCurrentUser()`): tabs/sections — **Favorites** (client island reading `localStorage 'akshita:favorites'`, resolving slugs via a passed-in lookup or a small server fetch), **Saved searches** (localStorage-based, optional), **My listings** (`listMyListings(user.id)` showing status badges: pending/published/rejected with reason). Link to `/sell`.
- `src/app/sell/page.tsx` + `src/components/sell/sell-wizard.tsx` (client, multi-step): step 1 basics (title, category fixed 'resell', listingType, locality select, price, bhk, areas), step 2 details (description + a **"Generate description" button** that fills a templated premium blurb from the inputs — local template now, upgraded to AI in Plan 4), amenities (multi-select chips), highlights, step 3 images (one or more image **URL** inputs; default to a pool image if blank), review + submit. Submit via Server Action `src/app/sell/actions.ts` → `createProperty({...status:'pending', source:'user', ownerId:user.id})`; show success + link to dashboard.
- Acceptance: submitting the wizard creates a pending listing visible in My listings and in the admin moderation queue; build green.

## Group 3.3 — Admin shell + dashboard + properties CRUD
- `src/app/admin/layout.tsx`: admin sidebar nav (Dashboard, Properties, Moderation, Leads, Blog, Localities) + content area. Gate with `getCurrentUser()` role admin (in demo mode always admin).
- `src/app/admin/page.tsx`: KPI cards (total published, pending moderation, total leads, new leads, featured count) from repo; recent leads list; recent listings.
- `src/app/admin/properties/page.tsx`: table of `listAllProperties()` (title, category, status, price, featured, actions edit/delete). Filter by status/category. "New property" button.
- `src/app/admin/properties/new/page.tsx` + `src/app/admin/properties/[slug]/edit/page.tsx`: a shared `PropertyForm` client component covering all editable fields (incl. premium-project fields when category=premium_project: developer, possession, configurations rows, etc.), featured toggle, status select, image URL list. Server Actions `createProperty`/`updateProperty`/`deleteProperty`. Redirect to the list on success.
- Acceptance: admin can create a property (appears in catalog if published), edit it, toggle featured, delete it; build green.

## Group 3.4 — Moderation queue + leads pipeline
- `src/app/admin/moderation/page.tsx`: list `listPendingProperties()` with preview; **Approve** (→ setPropertyStatus 'published') and **Reject** (with a reason → setPropertyStatus 'rejected', rejectionReason) via Server Actions. After action, item leaves the queue.
- `src/app/admin/leads/page.tsx`: leads pipeline — columns or a table grouped by status (new / contacted / closed); each lead shows name, phone, email, source channel, linked property, created date; a status control (Server Action `updateLeadStatus`) to move between states; quick `tel:`/`wa.me`/`mailto:` links.
- Acceptance: approving a pending listing publishes it (shows in catalog); rejecting records a reason (shown in seller's My listings); changing a lead's status persists; build green.

## Group 3.5 — Blog editor + localities manager
- `src/app/admin/blog/page.tsx` (list `listAllBlogPosts()` with status) + `new`/`[slug]/edit` with a `BlogForm` (title, cover URL, excerpt, body markdown textarea with a live preview, tags, status draft/published) → Server Actions create/update/delete.
- `src/app/admin/localities/page.tsx` (list) + create/edit form (name, slug, description, aiInsights, avgPricePerSqft, lat/lng) → Server Actions.
- Acceptance: creating/publishing a post shows it on `/insights`; editing a locality reflects on locality pages; build green.

---

## Cross-cutting acceptance (every group)
- `npx tsc --noEmit` clean; `npm test` green; `npm run build` passes.
- Premium, consistent admin UI (clean, data-dense but on-brand). Server Components for pages; client islands for forms/interactivity.
- All mutations go through repo functions (swappable to Supabase later). No direct store access from pages.
- Demo banner visible; demo bypass works.
