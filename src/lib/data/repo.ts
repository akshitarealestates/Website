import { properties as seedProperties } from './mock/properties';
import { localities as seedLocalities } from './mock/localities';
import { blogPosts as seedPosts } from './mock/blog';
import { imageFor } from './images';
import type {
  Property,
  Locality,
  BlogPost,
  Lead,
  PropertyFilters,
  PropertyCategory,
  PropertyStatus,
} from './types';

// ─── Mutable in-memory stores ────────────────────────────────────────────────
const propertyStore: Property[] = [...seedProperties];
const localityStore: Locality[] = [...seedLocalities];
const blogStore: BlogPost[] = [...seedPosts];
const leadStore: Lead[] = [];

// Simple monotonic counters for ids — no Math.random at module load
let leadCounter = 1;
let propertyCounter = 1;
let blogCounter = 1;
let localityCounter = 1;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Lowercase, hyphenated, ascii-only slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Return a slug unique within `existing`, appending -2, -3 … as needed. */
function uniqueSlug(base: string, existing: string[]): string {
  const slug = base || 'item';
  if (!existing.includes(slug)) return slug;
  let n = 2;
  while (existing.includes(`${slug}-${n}`)) n++;
  return `${slug}-${n}`;
}

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

// ─── Lead mutations ─────────────────────────────────────────────────────────

export function listLeads(): Lead[] {
  return [...leadStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function updateLeadStatus(id: string, status: Lead['status']): Lead | undefined {
  const lead = leadStore.find((l) => l.id === id);
  if (!lead) return undefined;
  lead.status = status;
  return lead;
}

// ─── Property mutations ───────────────────────────────────────────────────────

/** Returns ALL properties regardless of status — filterable, for admin use. */
export function listAllProperties(filters: PropertyFilters = {}): Property[] {
  let result = [...propertyStore];

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

  const sort = filters.sort ?? 'recent';
  if (sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else {
    result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return result;
}

export function createProperty(
  input: Partial<Property> & { title: string; category: PropertyCategory },
): Property {
  const slug = uniqueSlug(
    slugify(input.slug ?? input.title),
    propertyStore.map((p) => p.slug),
  );

  const property: Property = {
    id: `prop-gen-${String(propertyCounter++).padStart(6, '0')}`,
    slug,
    title: input.title,
    category: input.category,
    listingType: input.listingType ?? 'sale',
    price: input.price ?? 0,
    pricePeriod: input.pricePeriod ?? null,
    bhk: input.bhk ?? null,
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    carpetAreaSqft: input.carpetAreaSqft ?? null,
    builtupAreaSqft: input.builtupAreaSqft ?? null,
    furnishing: input.furnishing ?? null,
    floor: input.floor ?? null,
    totalFloors: input.totalFloors ?? null,
    city: input.city ?? 'Lucknow',
    localitySlug: input.localitySlug ?? '',
    address: input.address ?? null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    amenities: input.amenities ?? [],
    reraId: input.reraId ?? null,
    description: input.description ?? '',
    highlights: input.highlights ?? [],
    status: input.status ?? 'pending',
    source: input.source ?? 'user',
    ownerId: input.ownerId ?? null,
    isFeatured: input.isFeatured ?? false,
    views: 0,
    images:
      input.images && input.images.length > 0
        ? input.images
        : [{ url: imageFor(slug, 0), alt: input.title }],
    project: input.project ?? null,
    createdAt: new Date().toISOString(),
  };

  propertyStore.push(property);
  return property;
}

export function updateProperty(slug: string, patch: Partial<Property>): Property | undefined {
  const idx = propertyStore.findIndex((p) => p.slug === slug);
  if (idx === -1) return undefined;
  // Preserve slug and id; everything else patchable.
  const updated: Property = {
    ...propertyStore[idx],
    ...patch,
    id: propertyStore[idx].id,
    slug: propertyStore[idx].slug,
  };
  propertyStore[idx] = updated;
  return updated;
}

export function deleteProperty(slug: string): boolean {
  const idx = propertyStore.findIndex((p) => p.slug === slug);
  if (idx === -1) return false;
  propertyStore.splice(idx, 1);
  return true;
}

export function setPropertyStatus(
  slug: string,
  status: PropertyStatus,
  rejectionReason?: string,
): Property | undefined {
  const property = propertyStore.find((p) => p.slug === slug);
  if (!property) return undefined;
  property.status = status;
  if (status === 'rejected' && rejectionReason !== undefined) {
    property.rejectionReason = rejectionReason;
  }
  return property;
}

export function listPendingProperties(): Property[] {
  return propertyStore.filter((p) => p.status === 'pending');
}

export function listMyListings(ownerId: string): Property[] {
  return propertyStore.filter((p) => p.ownerId === ownerId);
}

// ─── Blog mutations ───────────────────────────────────────────────────────────

export function listAllBlogPosts(): BlogPost[] {
  return [...blogStore];
}

export function createBlogPost(
  input: Partial<BlogPost> & { title: string },
): BlogPost {
  const slug = uniqueSlug(
    slugify(input.slug ?? input.title),
    blogStore.map((b) => b.slug),
  );

  const post: BlogPost = {
    id: `blog-gen-${String(blogCounter++).padStart(6, '0')}`,
    slug,
    title: input.title,
    coverUrl: input.coverUrl ?? imageFor(slug, 0),
    excerpt: input.excerpt ?? '',
    body: input.body ?? '',
    author: input.author ?? 'Akshita Realty Team',
    status: input.status ?? 'draft',
    publishedAt: input.publishedAt ?? new Date().toISOString(),
    tags: input.tags ?? [],
  };

  blogStore.push(post);
  return post;
}

export function updateBlogPost(slug: string, patch: Partial<BlogPost>): BlogPost | undefined {
  const idx = blogStore.findIndex((b) => b.slug === slug);
  if (idx === -1) return undefined;
  const updated: BlogPost = {
    ...blogStore[idx],
    ...patch,
    id: blogStore[idx].id,
    slug: blogStore[idx].slug,
  };
  blogStore[idx] = updated;
  return updated;
}

export function deleteBlogPost(slug: string): boolean {
  const idx = blogStore.findIndex((b) => b.slug === slug);
  if (idx === -1) return false;
  blogStore.splice(idx, 1);
  return true;
}

// ─── Locality mutations ───────────────────────────────────────────────────────

export function createLocality(
  input: Partial<Locality> & { name: string },
): Locality {
  const slug = uniqueSlug(
    slugify(input.slug ?? input.name),
    localityStore.map((l) => l.slug),
  );

  const locality: Locality = {
    id: `loc-gen-${String(localityCounter++).padStart(6, '0')}`,
    name: input.name,
    slug,
    city: input.city ?? 'Lucknow',
    description: input.description ?? '',
    aiInsights: input.aiInsights ?? '',
    avgPricePerSqft: input.avgPricePerSqft ?? 6000,
    latitude: input.latitude ?? 0,
    longitude: input.longitude ?? 0,
  };

  localityStore.push(locality);
  return locality;
}

export function updateLocality(slug: string, patch: Partial<Locality>): Locality | undefined {
  const idx = localityStore.findIndex((l) => l.slug === slug);
  if (idx === -1) return undefined;
  const updated: Locality = {
    ...localityStore[idx],
    ...patch,
    id: localityStore[idx].id,
    slug: localityStore[idx].slug,
  };
  localityStore[idx] = updated;
  return updated;
}

export function deleteLocality(slug: string): boolean {
  const idx = localityStore.findIndex((l) => l.slug === slug);
  if (idx === -1) return false;
  localityStore.splice(idx, 1);
  return true;
}
