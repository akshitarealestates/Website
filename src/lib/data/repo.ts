import { properties as seedProperties } from './mock/properties';
import { localities as seedLocalities } from './mock/localities';
import { blogPosts as seedPosts } from './mock/blog';
import type { Property, Locality, BlogPost, Lead, PropertyFilters } from './types';

// ─── Mutable in-memory stores ────────────────────────────────────────────────
const propertyStore: Property[] = [...seedProperties];
const localityStore: Locality[] = [...seedLocalities];
const blogStore: BlogPost[] = [...seedPosts];
const leadStore: Lead[] = [];

// Simple monotonic counter for lead IDs — no Math.random at module load
let leadCounter = 1;

// ─── Property queries ─────────────────────────────────────────────────────────

export function listProperties(filters: PropertyFilters = {}): Property[] {
  let result = propertyStore.filter((p) => p.status === 'published');

  if (filters.category !== undefined) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.listingType !== undefined) {
    result = result.filter((p) => p.listingType === filters.listingType);
  }
  if (filters.localitySlug !== undefined) {
    result = result.filter((p) => p.localitySlug === filters.localitySlug);
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.bhk !== undefined) {
    result = result.filter((p) => p.bhk === filters.bhk);
  }
  if (filters.query !== undefined && filters.query.trim().length > 0) {
    const q = filters.query.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.localitySlug.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  // Sort
  const sort = filters.sort ?? 'recent';
  if (sort === 'price_asc') {
    result = result.slice().sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    result = result.slice().sort((a, b) => b.price - a.price);
  } else {
    // recent — createdAt descending
    result = result.slice().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return result;
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return propertyStore.find((p) => p.slug === slug);
}

export function listFeatured(limit = 6): Property[] {
  return propertyStore
    .filter((p) => p.status === 'published' && p.isFeatured)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function listSimilar(property: Property, limit = 3): Property[] {
  const candidates = propertyStore.filter(
    (p) =>
      p.status === 'published' &&
      p.slug !== property.slug &&
      p.category === property.category,
  );

  // Score: prefer same locality, then by price proximity
  const scored = candidates.map((p) => {
    const localityBonus = p.localitySlug === property.localitySlug ? 1000 : 0;
    const priceDiff = Math.abs(p.price - property.price);
    return { p, score: localityBonus - priceDiff };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}

// ─── Locality queries ─────────────────────────────────────────────────────────

export function listLocalities(): Locality[] {
  return [...localityStore];
}

export function getLocalityBySlug(slug: string): Locality | undefined {
  return localityStore.find((l) => l.slug === slug);
}

export function listPropertiesByLocality(slug: string): Property[] {
  return propertyStore.filter(
    (p) => p.status === 'published' && p.localitySlug === slug,
  );
}

// ─── Blog queries ─────────────────────────────────────────────────────────────

export function listBlogPosts(opts: { publishedOnly?: boolean } = {}): BlogPost[] {
  if (opts.publishedOnly === false) return [...blogStore];
  return blogStore.filter((post) => post.status === 'published');
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogStore.find((post) => post.slug === slug);
}

// ─── Valuation ────────────────────────────────────────────────────────────────

/** Round a number to the nearest ₹50,000 */
function roundToFiftyK(n: number): number {
  return Math.round(n / 50000) * 50000;
}

export function estimateValuation(input: {
  localitySlug: string;
  areaSqft: number;
  bhk?: number;
  type?: string;
}): { low: number; high: number; basis: string } {
  const locality = getLocalityBySlug(input.localitySlug);
  const pricePerSqft = locality?.avgPricePerSqft ?? 6000;
  const localityName = locality?.name ?? 'Lucknow';

  let base = pricePerSqft * input.areaSqft;

  // BHK multiplier: each BHK above 2 adds 4%; below 2 subtracts 4%. Clamped ±12%.
  if (input.bhk !== undefined) {
    const bhkFactor = Math.max(-0.12, Math.min(0.12, (input.bhk - 2) * 0.04));
    base = base * (1 + bhkFactor);
  }

  // Type multiplier
  const typeMultiplier: Record<string, number> = {
    villa: 1.15,
    plot: 0.9,
  };
  const type = (input.type ?? '').toLowerCase();
  const typeFactor = typeMultiplier[type] ?? 1;
  base = base * typeFactor;

  const low = roundToFiftyK(base * 0.92);
  const high = roundToFiftyK(base * 1.08);

  const formattedRate = `₹${pricePerSqft.toLocaleString('en-IN')}/sq ft in ${localityName}`;

  return { low, high, basis: formattedRate };
}

// ─── Lead creation ────────────────────────────────────────────────────────────

export function createLead(input: Omit<Lead, 'id' | 'status' | 'createdAt'>): Lead {
  const lead: Lead = {
    ...input,
    id: `lead-${String(leadCounter++).padStart(6, '0')}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  leadStore.push(lead);
  return lead;
}

// ─── Internal / Admin ─────────────────────────────────────────────────────────

/** Returns ALL properties regardless of status — for admin/moderation use only */
export function _allPropertiesForAdmin(): Property[] {
  return propertyStore;
}
