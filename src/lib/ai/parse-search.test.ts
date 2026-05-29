import { describe, it, expect } from 'vitest';
import { parseSearch } from './parse-search';

const LOCALITIES = [
  { name: 'Gomti Nagar', slug: 'gomti-nagar' },
  { name: 'Hazratganj', slug: 'hazratganj' },
  { name: 'Sushant Golf City', slug: 'sushant-golf-city' },
  { name: 'Indira Nagar', slug: 'indira-nagar' },
  { name: 'Aliganj', slug: 'aliganj' },
  { name: 'Mahanagar', slug: 'mahanagar' },
  { name: 'Vibhuti Khand', slug: 'vibhuti-khand' },
  { name: 'Jankipuram', slug: 'jankipuram' },
];

describe('parseSearch', () => {
  it('parses 3 BHK under 80 lakh in Gomti Nagar', () => {
    const result = parseSearch(
      'spacious 3 bhk under 80 lakh in gomti nagar',
      LOCALITIES,
    );
    expect(result.bhk).toBe(3);
    expect(result.maxPrice).toBe(8000000);
    expect(result.localitySlug).toBe('gomti-nagar');
    expect(result.query).toBe('spacious 3 bhk under 80 lakh in gomti nagar');
  });

  it('parses office space for rent in Hazratganj', () => {
    const result = parseSearch(
      'office space for rent in hazratganj',
      LOCALITIES,
    );
    expect(result.category).toBe('commercial');
    expect(result.listingType).toBe('rent');
    expect(result.localitySlug).toBe('hazratganj');
  });

  it('parses new project in Sushant Golf City under 3 cr', () => {
    const result = parseSearch(
      'new project in sushant golf city under 3 cr',
      LOCALITIES,
    );
    expect(result.category).toBe('premium_project');
    expect(result.maxPrice).toBe(30000000);
    expect(result.localitySlug).toBe('sushant-golf-city');
  });

  it('parses 2bhk resale', () => {
    const result = parseSearch('2bhk resale', LOCALITIES);
    expect(result.bhk).toBe(2);
    expect(result.category).toBe('resell');
  });

  it('parses shops below 1.5 cr', () => {
    const result = parseSearch('shops below 1.5 cr', LOCALITIES);
    expect(result.category).toBe('commercial');
    expect(result.maxPrice).toBe(15000000);
  });

  it('handles plain "villa" without crashing', () => {
    const result = parseSearch('villa', LOCALITIES);
    expect(result.query).toBe('villa');
    expect(result.bhk).toBeUndefined();
    expect(result.maxPrice).toBeUndefined();
    expect(result.localitySlug).toBeUndefined();
  });

  // Additional edge-case tests
  it('parses "50l" price shorthand', () => {
    const result = parseSearch('2 bhk under 50l', LOCALITIES);
    expect(result.maxPrice).toBe(5000000);
  });

  it('parses bedroom keyword', () => {
    const result = parseSearch('4 bedroom apartment', LOCALITIES);
    expect(result.bhk).toBe(4);
  });

  it('parses rent/lease listing type', () => {
    const result = parseSearch('warehouse for lease', LOCALITIES);
    expect(result.category).toBe('commercial');
    expect(result.listingType).toBe('rent');
  });

  it('parses resell / second-hand category', () => {
    const result = parseSearch('second hand flat in indira nagar', LOCALITIES);
    expect(result.category).toBe('resell');
    expect(result.localitySlug).toBe('indira-nagar');
  });

  it('parses under construction category', () => {
    const result = parseSearch('under construction 3 bhk', LOCALITIES);
    expect(result.category).toBe('premium_project');
    expect(result.bhk).toBe(3);
  });

  it('parses commercial: retail keyword', () => {
    const result = parseSearch('retail shop in aliganj', LOCALITIES);
    expect(result.category).toBe('commercial');
    expect(result.localitySlug).toBe('aliganj');
  });

  it('parses "upto 1.5 crore"', () => {
    const result = parseSearch('flat upto 1.5 crore', LOCALITIES);
    expect(result.maxPrice).toBe(15000000);
  });

  it('sets query to original trimmed text', () => {
    const result = parseSearch('  luxury penthouse  ', LOCALITIES);
    expect(result.query).toBe('luxury penthouse');
  });
});
