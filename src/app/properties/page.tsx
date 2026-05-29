import { Suspense } from 'react';
import Link from 'next/link';
import { listProperties, listLocalities } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { PropertyCard } from '@/components/property/property-card';
import { FilterBar } from '@/components/property/filter-bar';
import { SmartSearch } from '@/components/ai/smart-search';
import type { PropertyFilters, PropertyCategory } from '@/lib/data/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type RawParams = Record<string, string | string[] | undefined>;

const VALID_CATEGORIES = new Set<PropertyCategory>([
  'commercial',
  'resell',
  'premium_project',
]);

const VALID_SORTS = new Set(['recent', 'price_asc', 'price_desc']);

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

    listingType: undefined, // not surfaced in UI yet

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

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-ink text-white pt-24 pb-16">
        <Container>
          <SectionHeading
            overline="Catalog"
            title={activeTab.fullTitle}
            italicWord={activeTab.italicWord}
          />
        </Container>
      </div>

      <Container className="py-10">
        {/* ── Smart NL search ─────────────────────────────────────────── */}
        <div className="mb-8 rounded-2xl bg-ink p-5">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
            Describe what you&apos;re looking for
          </p>
          <SmartSearch
            localities={localities.map((l) => ({ name: l.name, slug: l.slug }))}
          />
        </div>

        {/* ── Segment tabs ────────────────────────────────────────────── */}
        <nav
          aria-label="Property category tabs"
          className="flex flex-wrap gap-2 mb-8 border-b border-black/8 pb-4"
        >
          {TABS.map((tab) => {
            const isActive = tab.category === filters.category;
            return (
              <Link
                key={tab.label}
                href={tabHref(raw, tab.category)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ink text-white'
                    : 'bg-white text-ink/60 hover:text-ink hover:bg-white/80 border border-black/8',
                ].join(' ')}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Filter bar (client island) ───────────────────────────── */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-black/5" />}>
            <FilterBar
              localities={localities}
              current={{
                ...filters,
              }}
            />
          </Suspense>
        </div>

        {/* ── Result count ────────────────────────────────────────────── */}
        <p className="text-sm text-ink/50 mb-6">
          {properties.length === 0
            ? 'No properties found'
            : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`}
        </p>

        {/* ── Grid ────────────────────────────────────────────────────── */}
        {properties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          /* ── Empty state ─────────────────────────────────────────── */
          <div className="flex flex-col items-center py-24 text-center">
            <p className="font-display text-2xl font-semibold text-ink mb-3">
              No properties match your <em className="italic font-normal">filters</em>
            </p>
            <p className="text-ink/50 text-sm mb-8 max-w-sm">
              Try broadening your search — remove a filter or explore a different category.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              Reset filters
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
