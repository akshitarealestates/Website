import { describe, it, expect } from 'vitest';
import { recommendFromFavorites } from './recommend';
import type { Property } from '@/lib/data/types';

function makeProperty(over: Partial<Property> & { slug: string }): Property {
  return {
    id: over.slug,
    title: over.slug,
    category: 'resell',
    listingType: 'sale',
    price: 5000000,
    city: 'Lucknow',
    localitySlug: 'gomti-nagar',
    amenities: [],
    description: '',
    highlights: [],
    status: 'published',
    source: 'admin',
    isFeatured: false,
    views: 0,
    images: [{ url: '/x.jpg', alt: 'x' }],
    createdAt: '2024-01-01T00:00:00.000Z',
    ...over,
  };
}

const ALL: Property[] = [
  makeProperty({ slug: 'feat-1', category: 'premium_project', isFeatured: true, price: 20000000 }),
  makeProperty({ slug: 'feat-2', category: 'premium_project', isFeatured: true, price: 18000000 }),
  makeProperty({ slug: 'resell-a', category: 'resell', price: 5000000, localitySlug: 'gomti-nagar' }),
  makeProperty({ slug: 'resell-b', category: 'resell', price: 5500000, localitySlug: 'gomti-nagar' }),
  makeProperty({ slug: 'resell-c', category: 'resell', price: 6000000, localitySlug: 'indira-nagar' }),
  makeProperty({ slug: 'commercial-a', category: 'commercial', price: 12000000 }),
  makeProperty({ slug: 'draft-x', category: 'resell', price: 5000000, status: 'draft' }),
];

describe('recommendFromFavorites', () => {
  it('returns featured listings when there are no favorites', () => {
    const recs = recommendFromFavorites([], ALL, 4);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.every((p) => p.isFeatured)).toBe(true);
  });

  it('never recommends non-published listings', () => {
    const recs = recommendFromFavorites([], ALL, 10);
    expect(recs.some((p) => p.status !== 'published')).toBe(false);
  });

  it('recommends same-category items and excludes the favorite itself', () => {
    const recs = recommendFromFavorites(['resell-a'], ALL, 4);
    expect(recs.find((p) => p.slug === 'resell-a')).toBeUndefined();
    // Dominant category is resell, so resell items should rank first.
    expect(recs[0].category).toBe('resell');
    expect(recs.some((p) => p.slug === 'resell-b')).toBe(true);
  });

  it('respects the limit', () => {
    const recs = recommendFromFavorites(['resell-a'], ALL, 2);
    expect(recs.length).toBe(2);
  });

  it('falls back to featured when favorites do not resolve', () => {
    const recs = recommendFromFavorites(['does-not-exist'], ALL, 4);
    expect(recs.every((p) => p.isFeatured)).toBe(true);
  });
});
