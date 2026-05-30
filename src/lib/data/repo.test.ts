import { describe, it, expect } from 'vitest';
import { listProperties, listFeatured, estimateValuation, createLead, listSimilar, getPropertyBySlug } from './repo';

describe('repo', () => {
  it('returns 20+ published properties', () => {
    const all = listProperties();
    expect(all.length).toBeGreaterThan(20);
    expect(all.every(p => p.status === 'published')).toBe(true);
  });
  it('filters by category', () => {
    const c = listProperties({ category: 'commercial' });
    expect(c.length).toBeGreaterThan(0);
    expect(c.every(p => p.category === 'commercial')).toBe(true);
  });
  it('filters by price range', () => {
    const r = listProperties({ minPrice: 10000000, maxPrice: 30000000 });
    expect(r.every(p => p.price >= 10000000 && p.price <= 30000000)).toBe(true);
  });
  it('featured are featured', () => {
    expect(listFeatured().every(p => p.isFeatured)).toBe(true);
  });
  it('valuation returns a sane band', () => {
    const v = estimateValuation({ localitySlug: 'gomti-nagar', areaSqft: 1200 });
    expect(v.low).toBeGreaterThan(0);
    expect(v.high).toBeGreaterThan(v.low);
  });
  it('createLead stores a lead', () => {
    const lead = createLead({ name: 'Test', phone: '9999999999', sourceChannel: 'enquiry_form' });
    expect(lead.id).toBeTruthy();
    expect(lead.status).toBe('new');
  });
  it('similar excludes self and matches category', () => {
    const p = listProperties()[0];
    const sim = listSimilar(p);
    expect(sim.every(s => s.slug !== p.slug && s.category === p.category)).toBe(true);
  });
});
