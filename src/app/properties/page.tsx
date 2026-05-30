import { Suspense } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { listProperties, listLocalities } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { ListingCard } from '@/components/property/listing-card';
import { FilterBar } from '@/components/property/filter-bar';
import { SmartSearch } from '@/components/ai/smart-search';
import type { PropertyFilters, PropertyCategory, ListingType } from '@/lib/data/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type RawParams = Record<string, string | string[] | undefined>;

const VALID_CATEGORIES = new Set<PropertyCategory>([
  'commercial',
  'resell',
  'premium_project',
]);

const VALID_SORTS = new Set(['recent', 'price_asc', 'price_desc']);

const VALID_LISTING_TYPES = new Set<ListingType>(['sale', 'rent']);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function str(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function parseFilters(raw: RawParams): PropertyFilters {
  const category = str(raw.category);
  const sort = str(raw.sort);

  return {
    category:
      category && VALID_CATEGORIES.has(category as PropertyCategory)
        ? (category as PropertyCategory)
        : undefined,

    listingType: VALID_LISTING_TYPES.has(str(raw.listingType) as ListingType)
      ? (str(raw.listingType) as ListingType)
      : undefined,

    localitySlug: str(raw.localitySlug) || undefined,

    // Accept plain minPrice/maxPrice (the format SearchBar emits after parsing
    // its own 'min:X:max:X' encoding into separate params before pushing).
    minPrice: raw.minPrice ? Number(str(raw.minPrice)) || undefined : undefined,
    maxPrice: raw.maxPrice ? Number(str(raw.maxPrice)) || undefined : undefined,

    bhk: raw.bhk ? Number(str(raw.bhk)) || undefined : undefined,

    query: str(raw.query) || undefined,

    sort:
      sort && VALID_SORTS.has(sort)
        ? (sort as PropertyFilters['sort'])
        : 'recent',
  };
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { label: 'All', category: undefined, title: 'All', italicWord: 'properties', fullTitle: 'All properties' },
  { label: 'Commercial', category: 'commercial' as PropertyCategory, title: 'Commercial', italicWord: 'spaces', fullTitle: 'Commercial spaces' },
  { label: 'Resell', category: 'resell' as PropertyCategory, title: 'Resell', italicWord: 'homes', fullTitle: 'Resell homes' },
  { label: 'Premium Projects', category: 'premium_project' as PropertyCategory, title: 'Premium', italicWord: 'projects', fullTitle: 'Premium projects' },
];

/** Build a new URL by merging the active params, overriding just `category`. */
function tabHref(
  current: RawParams,
  category: PropertyCategory | undefined,
): string {
  const params = new URLSearchParams();

  // Carry forward non-category filters
  for (const key of ['localitySlug', 'minPrice', 'maxPrice', 'bhk', 'sort', 'query']) {
    const v = str(current[key]);
    if (v) params.set(key, v);
  }

  if (category) params.set('category', category);

  const qs = params.toString();
  return qs ? `/properties?${qs}` : '/properties';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const raw = await searchParams;
  const filters = parseFilters(raw);
  const properties = listProperties(filters);
  const localities = listLocalities();

  // Pick the matching tab for heading
  const activeTab =
    TABS.find((t) => t.category === filters.category) ?? TABS[0];

  const count = properties.length;

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-ink pb-16 pt-24 text-white">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              overline="The collection"
              title={activeTab.fullTitle}
              italicWord={activeTab.italicWord}
              className="[&_h2]:text-white"
            />
            <p className="text-sm text-white/55">
              <span className="font-display text-2xl font-semibold text-gold">{count}</span>{' '}
              {count === 1 ? 'listing' : 'listings'} available
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        {/* ── Smart NL search ─────────────────────────────────────────── */}
        <div className="mb-8 rounded-3xl border border-black/5 bg-surface p-6 shadow-[0_14px_40px_-26px_rgba(43,33,24,0.4)]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-gold-deep">
            Describe what you&apos;re looking for
          </p>
          <SmartSearch
            localities={localities.map((l) => ({ name: l.name, slug: l.slug }))}
          />
        </div>

        {/* ── Toolbar: segment tabs + filters ─────────────────────────── */}
        <div className="mb-8 space-y-5">
          {/* Segment tabs as a soft segmented control */}
          <nav
            aria-label="Property category tabs"
            className="inline-flex flex-wrap gap-1 rounded-full border border-black/8 bg-surface p-1"
          >
            {TABS.map((tab) => {
              const isActive = tab.category === filters.category;
              return (
                <Link
                  key={tab.label}
                  href={tabHref(raw, tab.category)}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-ink text-cream shadow-sm'
                      : 'text-ink-soft hover:bg-ink/5',
                  ].join(' ')}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* Filter bar (client island) */}
          <Suspense fallback={<div className="h-12 animate-pulse rounded-full bg-black/5" />}>
            <FilterBar
              localities={localities}
              current={{
                ...filters,
              }}
            />
          </Suspense>
        </div>

        {/* ── Result count ────────────────────────────────────────────── */}
        <p className="mb-6 text-sm text-sand-muted">
          {count === 0
            ? 'No properties found'
            : `Showing ${count} ${count === 1 ? 'property' : 'properties'}`}
        </p>

        {/* ── Grid ────────────────────────────────────────────────────── */}
        {count > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <ListingCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          /* ── Empty state ─────────────────────────────────────────── */
          <div className="mx-auto flex max-w-md flex-col items-center rounded-[2rem] border border-black/5 bg-surface px-8 py-20 text-center shadow-[0_18px_48px_-30px_rgba(43,33,24,0.4)]">
            <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gold/12 text-gold-deep">
              <Search className="h-6 w-6" />
            </span>
            <p className="mb-3 font-display text-2xl font-semibold text-ink">
              No properties match your <em className="font-normal italic text-gold-deep">filters</em>
            </p>
            <p className="mb-8 max-w-sm text-sm text-sand-muted">
              Try broadening your search — remove a filter or explore a different category.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90"
            >
              Reset filters
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
