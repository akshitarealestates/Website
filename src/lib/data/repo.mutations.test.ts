import { describe, it, expect } from 'vitest';
import {
  createProperty,
  updateProperty,
  deleteProperty,
  setPropertyStatus,
  listAllProperties,
  listProperties,
  listPendingProperties,
  listMyListings,
  createLead,
  listLeads,
  updateLeadStatus,
  createBlogPost,
  listAllBlogPosts,
  updateBlogPost,
  deleteBlogPost,
  createLocality,
  updateLocality,
  deleteLocality,
} from './repo';

describe('property mutations', () => {
  it('createProperty returns a slug and appears in listAllProperties', () => {
    const p = createProperty({ title: 'My Test Villa', category: 'resell' });
    expect(p.slug).toBe('my-test-villa');
    expect(p.views).toBe(0);
    expect(p.images.length).toBeGreaterThan(0);
    expect(listAllProperties().some((x) => x.slug === p.slug)).toBe(true);
  });

  it('createProperty dedupes slugs', () => {
    const a = createProperty({ title: 'Duplicate Name Home', category: 'resell' });
    const b = createProperty({ title: 'Duplicate Name Home', category: 'resell' });
    expect(a.slug).not.toBe(b.slug);
    expect(b.slug).toMatch(/-2$/);
  });

  it('updateProperty applies the patch', () => {
    const p = createProperty({ title: 'Patchable Property', category: 'commercial', price: 100 });
    const updated = updateProperty(p.slug, { price: 999, title: 'Renamed' });
    expect(updated?.price).toBe(999);
    expect(updated?.title).toBe('Renamed');
    expect(updated?.slug).toBe(p.slug);
  });

  it('setPropertyStatus pending→published makes it visible in listProperties', () => {
    const p = createProperty({ title: 'Pending To Published', category: 'resell', status: 'pending' });
    expect(listProperties().some((x) => x.slug === p.slug)).toBe(false);
    expect(listPendingProperties().some((x) => x.slug === p.slug)).toBe(true);
    setPropertyStatus(p.slug, 'published');
    expect(listProperties().some((x) => x.slug === p.slug)).toBe(true);
  });

  it('setPropertyStatus reject sets rejectionReason', () => {
    const p = createProperty({ title: 'To Be Rejected', category: 'resell', status: 'pending' });
    const rejected = setPropertyStatus(p.slug, 'rejected', 'Incomplete documents');
    expect(rejected?.status).toBe('rejected');
    expect(rejected?.rejectionReason).toBe('Incomplete documents');
  });

  it('deleteProperty removes it', () => {
    const p = createProperty({ title: 'Delete Me Property', category: 'resell' });
    expect(deleteProperty(p.slug)).toBe(true);
    expect(listAllProperties().some((x) => x.slug === p.slug)).toBe(false);
    expect(deleteProperty(p.slug)).toBe(false);
  });

  it('listMyListings filters by ownerId', () => {
    const p = createProperty({ title: 'Owned Listing', category: 'resell', ownerId: 'owner-xyz' });
    expect(listMyListings('owner-xyz').some((x) => x.slug === p.slug)).toBe(true);
    expect(listMyListings('someone-else').some((x) => x.slug === p.slug)).toBe(false);
  });
});

describe('lead mutations', () => {
  it('updateLeadStatus changes status', () => {
    const lead = createLead({ name: 'Lead Person', phone: '8888888888', sourceChannel: 'contact' });
    expect(listLeads().some((l) => l.id === lead.id)).toBe(true);
    const updated = updateLeadStatus(lead.id, 'contacted');
    expect(updated?.status).toBe('contacted');
  });
});

describe('blog mutations', () => {
  it('createBlogPost + listAllBlogPosts', () => {
    const post = createBlogPost({ title: 'A Fresh Blog Post' });
    expect(post.slug).toBe('a-fresh-blog-post');
    expect(listAllBlogPosts().some((b) => b.slug === post.slug)).toBe(true);
  });

  it('updateBlogPost and deleteBlogPost', () => {
    const post = createBlogPost({ title: 'Editable Post' });
    expect(updateBlogPost(post.slug, { title: 'Edited Title' })?.title).toBe('Edited Title');
    expect(deleteBlogPost(post.slug)).toBe(true);
    expect(listAllBlogPosts().some((b) => b.slug === post.slug)).toBe(false);
  });
});

describe('locality mutations', () => {
  it('createLocality auto-slugs from name', () => {
    const loc = createLocality({ name: 'New Town Area' });
    expect(loc.slug).toBe('new-town-area');
  });

  it('updateLocality and deleteLocality', () => {
    const loc = createLocality({ name: 'Temp Locality' });
    expect(updateLocality(loc.slug, { avgPricePerSqft: 7777 })?.avgPricePerSqft).toBe(7777);
    expect(deleteLocality(loc.slug)).toBe(true);
  });
});
