# Akshita Realty — Premium Real Estate Platform — Design Spec

**Date:** 2026-05-29
**Status:** Approved design, pending implementation plan
**Launch city:** Lucknow, India (multi-city ready)

---

## 1. Overview

A premium real estate web platform for **Akshita Realty**, launching in Lucknow and
architected to expand to other cities. It serves three property verticals
(**Commercial**, **Resell**, **Premium Projects**), lets users register and list resell
properties (admin-moderated), captures buyer enquiries as leads across multiple channels,
and layers an advanced AI suite for a premium, modern experience.

Built on **Next.js (App Router) + Supabase + Vercel**, deployed via Vercel.

### Goals
- A visually premium, editorial, fast site that builds trust.
- Three property verticals with distinct presentation but shared catalog infrastructure.
- Self-serve resell listing with AI assistance and admin moderation.
- Multi-channel lead capture (dashboard, email, WhatsApp, CRM webhook).
- A differentiated AI layer (conversational search, concierge, recommendations, valuation, locality insights, EMI advisor, auto listing writer).
- Custom admin panel for full content/lead management.

### Non-goals (v1) — easy to add later
- Phone OTP login (needs paid SMS provider) — phase 2.
- Full map-pin search experience (needs Maps JS API billing) — phase 2.
- Online payments / booking fees / transactions.
- AI photo auto-tagging / enhancement.
- Native mobile app.

---

## 2. Market & content assumptions
- **Currency:** ₹ INR, displayed in Indian conventions (lakh / crore).
- **Property conventions:** BHK, carpet & built-up area (sq ft), RERA ID, Lucknow localities
  (Gomti Nagar, Hazratganj, Sushant Golf City, Indira Nagar, Aliganj, etc.).
- **Launch content:** seeded with ~25–30 realistic Lucknow listings across all three
  categories, premium stock architecture photography (Unsplash), locality data, and a few
  sample insights articles — so the site looks complete and live at launch. Real data
  entered later via admin.

---

## 3. Visual system — "Editorial Elegance" (Direction A)
- **Display type:** Fraunces (serif), using italic for elegant secondary phrases.
- **UI/body type:** Inter.
- **Palette:** Ink `#15202B`, Sky `#AEBFD1`, Cream `#F6F4EF`, White, Gold accent `#C89B3C`.
- **Style:** large editorial headlines, generous whitespace, soft-rounded cards (`rounded-2xl`),
  subtle shadows, full-bleed premium architecture photography, tasteful hover lifts and
  smooth micro-interactions (Framer Motion).
- **Components:** Tailwind CSS + shadcn/ui as the component base, themed to the palette.
- **Accessibility:** WCAG-AA contrast, keyboard navigable, focus states, alt text on images.

---

## 4. Tech architecture
- **Framework:** Next.js App Router on Vercel. Server Components by default; `'use client'`
  only for interactive islands (search bar, chatbot, filters, forms, dashboards).
- **Single monolith** containing: marketing pages, property catalog, authenticated user
  dashboard, `/admin` panel, and API/route handlers + server actions.
- **Database:** Supabase Postgres with the **pgvector** extension for embeddings.
- **Auth:** Supabase Auth — Google OAuth (primary) + email/password (fallback + admin).
- **Storage:** Supabase Storage for property images (public read bucket, authenticated write).
- **AI:** Vercel AI Gateway + Vercel AI SDK (model routing, fallback, streaming). Embeddings
  model for semantic search/recommendations and locality/listing vectors.
- **Email:** Resend for transactional lead notifications.
- **WhatsApp:** click-to-chat (`wa.me`) deep links — no API billing for v1.
- **CRM hook:** outbound webhook (n8n-compatible) fired on new lead.
- **Config:** `vercel.ts` for project config; environment variables via Vercel env.
- **Proxy/middleware:** `proxy.ts` for auth gating of `/dashboard` and `/admin` routes.

---

## 5. Data model (Supabase / Postgres)

> RLS is enabled on all tables. Public role can read only `published` content and insert leads.

- **`profiles`** — `id` (= auth.users.id), full_name, phone, avatar_url,
  `role` enum (`buyer` | `seller` | `admin`), created_at. Auto-created on signup via trigger.
- **`properties`** — id, slug (unique), title,
  `category` enum (`commercial` | `resell` | `premium_project`),
  `listing_type` enum (`sale` | `rent`),
  price (bigint, ₹), price_period (for rent), bhk, bedrooms, bathrooms,
  carpet_area_sqft, builtup_area_sqft, furnishing, floor, total_floors,
  `city` (default 'Lucknow'), locality_id (fk), address, latitude, longitude,
  amenities (text[]), rera_id, description, highlights (text[]),
  `status` enum (`draft` | `pending` | `published` | `sold` | `rejected`),
  rejection_reason, `source` enum (`admin` | `user`), owner_id (fk profiles),
  is_featured (bool), embedding (vector), views (int), created_at, updated_at.
- **`property_images`** — id, property_id (fk), storage_path, alt, sort_order, is_cover.
- **`project_details`** — property_id (fk, for premium_project), developer_name,
  possession_date, configurations (jsonb: type/size/price rows), brochure_path,
  total_units, project_status, amenities_extended.
- **`localities`** — id, name, city, slug, description, ai_insights (text, cached),
  avg_price_per_sqft (for valuation baseline), latitude, longitude.
- **`leads`** — id, name, phone, email, message, property_id (nullable fk),
  `source_channel` enum (`enquiry_form` | `chatbot` | `valuation` | `whatsapp` | `contact`),
  `status` enum (`new` | `contacted` | `closed`), assigned_to, created_at.
- **`valuations`** — id, name, phone, email, locality_id, area_sqft, bhk, property_type,
  estimated_low, estimated_high, created_at. (Also written as a `valuation` lead.)
- **`favorites`** — user_id (fk), property_id (fk), created_at (composite pk).
- **`saved_searches`** — id, user_id, label, filters (jsonb), notify (bool), created_at.
- **`chat_sessions`** / **`chat_messages`** — persisted concierge conversations (optional,
  for context + lead trail).
- **`blog_posts`** — id, slug, title, cover_path, excerpt, body (markdown/mdx), author,
  `status` (draft | published), published_at, tags (text[]).

### RLS summary
- `properties`, `property_images`, `project_details`, `blog_posts`: public read where
  `status = 'published'`; sellers read/write **own** rows (resell only); admin full access.
- `leads`, `valuations`: public **insert**; read/update **admin only**.
- `favorites`, `saved_searches`, `chat_*`: owner-only.
- `profiles`: owner reads/writes own; admin reads all; role changes admin-only.

---

## 6. Site map & pages

**Marketing**
- `/` Home — hero, conversational search, featured/best properties, three-vertical entry,
  property management section, stats, insights teaser, CTA.
- `/about`, `/services` (property management), `/contact` (form → lead).
- `/insights`, `/insights/[slug]` — blog.

**Catalog**
- `/properties` — segmented by Commercial / Resell / Premium Projects; filters (locality,
  price, BHK, type, area); **conversational search bar**; sort; pagination/load-more.
- `/properties/[slug]` — gallery, specs, map embed, **AI locality insights**, **EMI advisor**,
  similar/recommended, enquiry form + WhatsApp button, share/favorite.
- `/projects/[slug]` — richer premium-project template (developer, configs, possession,
  brochure download, gallery).
- `/localities/[slug]` — locality landing (insights + listings there).

**Authenticated user**
- `/dashboard` — favorites, saved searches, my enquiries.
- `/sell` — guided resell listing wizard → **AI listing writer** → submit (status `pending`).
- `/dashboard/listings` — my listings + moderation status + edit.

**Admin** (`/admin`, role-gated)
- Dashboard (KPIs: listings, pending, leads by status, views).
- Properties CRUD (create/edit, image upload, featured toggle, category).
- **Moderation queue** (pending resell → approve/edit/reject with reason).
- Leads pipeline (kanban: new → contacted → closed; assign; export).
- Blog editor. Locality manager. Users list / role management.

---

## 7. Three verticals
- **Commercial** & **Premium Projects** — admin-created and managed only (`source = admin`).
  Premium Projects use the richer `project_details` template.
- **Resell** — logged-in seller submits via guided wizard; **AI auto-generates** a polished
  description from structured inputs; listing saved as `pending`; enters admin **moderation
  queue**; admin approves (→ `published`), edits, or rejects (with reason shown to seller).
  Seller tracks status in their dashboard.

---

## 8. AI features

All via Vercel AI SDK through AI Gateway (model routing + fallback). Implementation approach:

1. **Conversational search** — `generateObject` with a Zod schema parses a natural-language
   query into structured filters; query the DB. Fallback/augment with pgvector semantic
   similarity over listing embeddings. Graceful degrade to keyword filters if AI unavailable.
2. **Concierge chatbot** — streaming AI SDK agent with **tools**: `searchListings`,
   `getLocalityInfo`, `createLead`. Floating widget on all pages; persists to `chat_*`;
   creates qualified leads (`source_channel = chatbot`).
3. **Auto listing writer** — `generateText` converts seller's structured inputs into a
   premium description + highlights; seller can edit before submit.
4. **Smart recommendations** — pgvector cosine similarity for "similar properties";
   personalized picks derived from a user's favorites/saved searches embeddings.
5. **Price/valuation estimate** — locality ₹/sqft baselines (from `localities`) × area with
   BHK/type adjustment → range; AI writes a short rationale. Captures a seller lead.
6. **Locality insights** — AI-generated Lucknow neighborhood briefs (connectivity, schools,
   markets, lifestyle), cached in `localities.ai_insights`, regenerable from admin.
7. **EMI / affordability advisor** — EMI calculator (principal/rate/tenure) plus an AI
   explainer that interprets affordability and suggests matching listings.

Embeddings are generated/updated on property publish (and on locality save) and stored in
the `embedding` vector column.

---

## 9. Leads & delivery
Every enquiry, chatbot-captured lead, contact submission, and valuation writes a row to
`leads` (valuations also to `valuations`). On insert, fan out:
- **Admin pipeline** — kanban board with status + assignment.
- **Email** — Resend notification to the agency inbox.
- **WhatsApp** — `wa.me` click-to-chat buttons on listings/detail for instant buyer contact.
- **CRM webhook** — outbound POST (n8n-compatible) for future CRM sync.

Fan-out runs server-side (server action / route handler) after the DB insert; channel
failures are logged and never block the user-facing confirmation.

---

## 10. Admin panel
Role-gated by `proxy.ts` (redirect non-admins) **and** RLS (defense in depth). Server-side
role checks on all admin actions. Sections per §6. Image uploads go to Supabase Storage with
signed/authenticated writes.

---

## 11. Cross-cutting concerns
- **Multi-city:** `city` on properties + localities; city-scoped filtering and routing-ready;
  Lucknow is launch city. Adding a city = adding localities + listings, no schema change.
- **SEO:** SSR + per-page metadata, dynamic sitemap, `RealEstateListing` structured data,
  fast LCP via `next/image`, semantic HTML.
- **Performance:** Server Components, image optimization, streaming for AI responses,
  pagination, sensible caching of marketing/catalog pages.
- **Security:** Supabase RLS is the authorization backbone; server-side admin verification;
  Zod validation on all inputs; secrets in Vercel env; rate-limiting on AI + lead endpoints.
- **Error handling:** AI features degrade gracefully (fallbacks, never block core browsing);
  lead delivery channel failures are logged, not surfaced to user.

---

## 12. Seed data
- ~25–30 properties across Commercial / Resell / Premium Projects with premium imagery.
- Lucknow localities with descriptions + ₹/sqft baselines.
- 3–5 insights articles.
- One admin account + a couple of sample buyer/seller profiles.

---

## 13. Phasing note
Although delivered as one comprehensive build, AI features degrade independently, so the
core catalog + auth + admin + leads can function even if an AI provider is unconfigured.
Phase-2 items listed in §1 non-goals.
