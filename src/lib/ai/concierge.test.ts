import { describe, it, expect } from 'vitest';
import { respond, type ConciergeContext } from './concierge';

const CTX: ConciergeContext = {
  localities: [
    { name: 'Gomti Nagar', slug: 'gomti-nagar' },
    { name: 'Hazratganj', slug: 'hazratganj' },
    { name: 'Indira Nagar', slug: 'indira-nagar' },
  ],
};

describe('concierge respond', () => {
  it('greets and offers help', () => {
    const r = respond('Hello there', CTX);
    expect(r.reply).toMatch(/concierge/i);
    expect(r.filters).toBeUndefined();
    expect(r.captureLead).toBeFalsy();
  });

  it('returns parsed filters for a search intent', () => {
    const r = respond('show me 3 bhk in gomti nagar under 80 lakh', CTX);
    expect(r.filters).toBeDefined();
    expect(r.filters?.bhk).toBe(3);
    expect(r.filters?.localitySlug).toBe('gomti-nagar');
    expect(r.filters?.maxPrice).toBe(8000000);
    expect(r.reply).toMatch(/matching your search/i);
  });

  it('answers a locality question', () => {
    const r = respond('tell me about the gomti nagar area', CTX);
    expect(r.reply).toMatch(/Gomti Nagar/);
    expect(r.filters).toBeUndefined();
  });

  it('gives price / EMI guidance', () => {
    const r = respond('what about the emi and loan options', CTX);
    expect(r.reply).toMatch(/EMI calculator|valuation/i);
    expect(r.filters).toBeUndefined();
  });

  it('captures a lead for contact intent', () => {
    const r = respond('I want to talk to an agent', CTX);
    expect(r.captureLead).toBe(true);
    expect(r.reply).toMatch(/name and phone/i);
  });

  it('falls back to a helpful menu', () => {
    const r = respond('asdfghjkl', CTX);
    expect(r.reply).toMatch(/search listings|locality|valuation/i);
    expect(r.filters).toBeUndefined();
    expect(r.captureLead).toBeFalsy();
  });
});
