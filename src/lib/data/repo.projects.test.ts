import { describe, it, expect } from 'vitest';
import { projectStartingPrice, projectBhkRange } from './repo';
import type { Property, ProjectConfiguration } from './types';

function makeProperty(configurations: ProjectConfiguration[]): Property {
  return {
    id: 'test-1',
    slug: 'test-project',
    title: 'Test Project',
    category: 'premium_project',
    listingType: 'sale',
    price: 0,
    city: 'Lucknow',
    localitySlug: 'gomti-nagar',
    amenities: [],
    description: '',
    highlights: [],
    status: 'published',
    source: 'admin',
    isFeatured: false,
    views: 0,
    images: [{ url: 'x', alt: 'x' }],
    createdAt: '2026-01-01T00:00:00.000Z',
    project: {
      developerName: 'Dev',
      possessionDate: '2027-12-31',
      configurations,
      amenitiesExtended: [],
    },
  };
}

describe('projectStartingPrice', () => {
  it('returns the minimum configuration price', () => {
    const p = makeProperty([
      { type: '3 BHK', sizeSqft: 1750, price: 18500000 },
      { type: '2 BHK', sizeSqft: 1150, price: 10500000 },
      { type: '4 BHK', sizeSqft: 2300, price: 24500000 },
    ]);
    expect(projectStartingPrice(p)).toBe(10500000);
  });

  it('returns the single price when there is one configuration', () => {
    const p = makeProperty([{ type: '3 BHK', sizeSqft: 1350, price: 12500000 }]);
    expect(projectStartingPrice(p)).toBe(12500000);
  });

  it('returns null when there are no configurations', () => {
    const p = makeProperty([]);
    expect(projectStartingPrice(p)).toBeNull();
  });

  it('returns null when the property is not a project', () => {
    const p = makeProperty([]);
    p.project = null;
    expect(projectStartingPrice(p)).toBeNull();
  });
});

describe('projectBhkRange', () => {
  it('returns a range across distinct BHK counts', () => {
    const p = makeProperty([
      { type: '2 BHK', sizeSqft: 1150, price: 10500000 },
      { type: '3 BHK + Study', sizeSqft: 1600, price: 15500000 },
      { type: '4 BHK', sizeSqft: 2300, price: 24500000 },
    ]);
    expect(projectBhkRange(p)).toBe('2–4 BHK');
  });

  it('returns a single value when only one BHK count is present', () => {
    const p = makeProperty([
      { type: '3 BHK', sizeSqft: 1350, price: 12500000 },
      { type: '3 BHK Premium', sizeSqft: 1480, price: 13200000 },
    ]);
    expect(projectBhkRange(p)).toBe('3 BHK');
  });

  it('ignores non-BHK configurations like villas/penthouses without a number', () => {
    const p = makeProperty([
      { type: '3 BHK', sizeSqft: 1750, price: 18500000 },
      { type: 'Penthouse', sizeSqft: 3800, price: 42000000 },
    ]);
    expect(projectBhkRange(p)).toBe('3 BHK');
  });

  it('returns null when no BHK can be parsed', () => {
    const p = makeProperty([{ type: 'Penthouse', sizeSqft: 3800, price: 42000000 }]);
    expect(projectBhkRange(p)).toBeNull();
  });
});
