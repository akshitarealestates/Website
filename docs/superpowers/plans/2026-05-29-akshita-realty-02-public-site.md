# Akshita Realty — Plan 2: Data Layer + Premium Public Site

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps tracked via checkboxes.

**Goal:** A swappable data-access layer backed by rich mock Lucknow data + premium imagery, and the full premium public site (home, catalog with 3 verticals, property/project/locality detail, marketing pages, insights/blog) reading entirely through that layer.

**Architecture:** All data flows through `src/lib/data/` (domain types + repository functions). Today the repo returns in-memory mock data; connecting Supabase later means re-implementing repo functions only — no page/UI changes. UI-facing **domain types** are decoupled from raw DB rows. Images come from verified remote URLs (Unsplash, with picsum fallback) configured in `next.config`.

**Tech Stack:** Next.js 16 App Router (Server Components), Tailwind v4, shadcn/ui, Framer Motion, `next/image`.

> **Demo reality:** Supabase is not connected. Pages must render from mock data with no env. Mutations (admin/resell, added in Plan 3) use module-level in-memory stores that persist while the dev server runs.

---

## The data contract (single source of truth)

`src/lib/data/types.ts` — domain types used by ALL UI:

```ts
export type PropertyCategory = 'commercial' | 'resell' | 'premium_project';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'draft' | 'pending' | 'published' | 'sold' | 'rejected';

export interface PropertyImage { url: string; alt: string }

export interface ProjectDetails {
  developerName: string;
  possessionDate: string;            // ISO date
  configurations: { type: string; sizeSqft: number; price: number }[];
  brochureUrl?: string;
  totalUnits?: number;
  projectStatus?: string;
  amenitiesExtended: string[];
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  category: PropertyCategory;
  listingType: ListingType;
  price: number;                     // rupees
  pricePeriod?: string | null;       // 'month' for rent
  bhk?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  carpetAreaSqft?: number | null;
  builtupAreaSqft?: number | null;
  furnishing?: string | null;
  floor?: number | null;
  totalFloors?: number | null;
  city: string;                      // 'Lucknow'
  localitySlug: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  amenities: string[];
  reraId?: string | null;
  description: string;
  highlights: string[];
  status: PropertyStatus;
  source: 'admin' | 'user';
  ownerId?: string | null;
  isFeatured: boolean;
  views: number;
  images: PropertyImage[];
  project?: ProjectDetails | null;   // present for premium_project
  createdAt: string;                 // ISO
}

export interface Locality {
  id: string; name: string; slug: string; city: string;
  description: string; aiInsights: string;
  avgPricePerSqft: number; latitude: number; longitude: number;
}

export interface Lead {
  id: string; name: string; phone: string; email?: string | null;
  message?: string | null; propertySlug?: string | null;
  sourceChannel: 'enquiry_form' | 'chatbot' | 'valuation' | 'whatsapp' | 'contact';
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface BlogPost {
  id: string; slug: string; title: string; coverUrl: string;
  excerpt: string; body: string; author: string;
  status: 'draft' | 'published'; publishedAt: string; tags: string[];
}

export interface PropertyFilters {
  category?: PropertyCategory;
  listingType?: ListingType;
  localitySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  bhk?: number;
  query?: string;
  sort?: 'recent' | 'price_asc' | 'price_desc';
}
```

`src/lib/data/repo.ts` — the read functions the public site uses (Plan 3 adds mutations):

```ts
listProperties(filters?: PropertyFilters): Property[]   // published only, filtered + sorted
getPropertyBySlug(slug: string): Property | undefined
listFeatured(limit?: number): Property[]
listSimilar(property: Property, limit?: number): Property[]   // same category/locality, near price
listLocalities(): Locality[]
getLocalityBySlug(slug: string): Locality | undefined
listPropertiesByLocality(slug: string): Property[]
listBlogPosts(opts?: { publishedOnly?: boolean }): BlogPost[]
getBlogPostBySlug(slug: string): BlogPost | undefined
estimateValuation(input: { localitySlug: string; areaSqft: number; bhk?: number; type?: string }): { low: number; high: number; basis: string }
createLead(input: Omit<Lead, 'id' | 'status' | 'createdAt'>): Lead   // pushes to in-memory store
```

`estimateValuation`: `base = locality.avgPricePerSqft * areaSqft`, with a ±8% band and a small BHK/type multiplier; returns rounded low/high. This is a REAL working feature (no AI needed).

---

## Task groups

### Group 2.1 — Data layer + mock data + images config
- `src/lib/data/types.ts` (above), `src/lib/data/repo.ts` (above, mock-backed via stores), `src/lib/data/mock/{properties,localities,blog}.ts`, `src/lib/data/images.ts` (verified URL pool).
- ~26 Lucknow properties across all 3 categories (commercial, resell, premium_project), realistic ₹ prices, BHK, areas, RERA ids, amenities, 8+ localities (Gomti Nagar, Hazratganj, Sushant Golf City, Indira Nagar, Aliganj, Mahanagar, Vibhuti Khand, Jankipuram), 5 blog posts. Every property has 3-5 images and a cover.
- `next.config.ts`: add `images.remotePatterns` for `images.unsplash.com` and `picsum.photos`.
- **Image robustness:** define an image pool of Unsplash URLs; `curl -I` verify each; drop/replace any non-200 with a `picsum.photos/seed/<slug>/1200/800` fallback so NO broken images ever render.
- Acceptance: `npm run build` passes; a quick unit test asserts `listProperties()` returns >20 published items and filters by category/price work; `estimateValuation` returns sane bands (TDD this function).

### Group 2.2 — Home + marketing + shared property UI
- Premium home (`/`): hero with prominent search bar (location/price/BHK/type → links to /properties with query), featured properties grid, three-vertical entry cards, "Property management" section, stats band (2012 / communities / employees / buyers), insights teaser, CTA. Match Direction-A editorial style + reference screenshots.
- Shared components: `PropertyCard`, `SearchBar` (client; builds querystring), `SectionHeading`, `Stat`, `Container`.
- `/about`, `/services` (property management), `/contact` (form → `createLead` via server action, source `contact`).
- Acceptance: home renders featured cards from repo; search bar navigates to `/properties?...`; build passes.

### Group 2.3 — Catalog + filters + 3 verticals
- `/properties`: reads `searchParams` (category, listingType, localitySlug, min/max price, bhk, query, sort), calls `listProperties(filters)`, renders segmented tabs (All / Commercial / Resell / Premium Projects) as links, a filter sidebar/bar (client → updates querystring), result grid of `PropertyCard`, empty state, result count.
- Acceptance: filtering by each facet works via URL; segments switch category; build passes.

### Group 2.4 — Detail pages (property, project, locality)
- `/properties/[slug]`: image gallery, full specs grid, highlights, amenities, description, **map embed** (Google Maps iframe via lat/lng — `https://www.google.com/maps?q=<lat>,<lng>&output=embed`, no API key), locality insights card (from repo), **EMI calculator** (client, fully functional), **similar properties** (`listSimilar`), enquiry form (server action → `createLead`, source `enquiry_form`), WhatsApp "Enquire" button (`wa.me` deep link with prefilled text), favorite button (localStorage; component is client). `generateStaticParams` from published slugs; `notFound()` for unknown.
- Premium-project listings additionally render the `project` block (developer, possession, configurations table, brochure link, project status). Reuse the same route; branch on `category === 'premium_project'`.
- `/localities/[slug]`: locality hero + insights + its listings.
- Acceptance: detail renders all sections; EMI calc updates live; enquiry submit creates a lead (verify via a temporary debug or repo length); map iframe present; build passes.

### Group 2.5 — Insights / blog
- `/insights` (published posts grid), `/insights/[slug]` (article render; body is markdown — render with a lightweight renderer or pre-formatted blocks). `generateStaticParams`.
- Acceptance: list + article render from repo; build passes.

---

## Cross-cutting acceptance (every group)
- `npx tsc --noEmit` clean, `npm test` green, `npm run build` passes with NO env.
- No broken images (verified URLs / fallback).
- Premium, consistent Editorial-Elegance styling; responsive; `next/image` everywhere.
- Components small and focused; pages are Server Components, interactivity isolated to `'use client'` islands.
