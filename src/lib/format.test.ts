import { describe, it, expect } from 'vitest';
import { formatINR, formatArea } from './format';

describe('formatINR', () => {
  it('formats crores', () => {
    expect(formatINR(14000000)).toBe('₹1.4 Cr');
    expect(formatINR(32000000)).toBe('₹3.2 Cr');
    expect(formatINR(12500000)).toBe('₹1.25 Cr');
  });
  it('formats lakhs', () => {
    expect(formatINR(7800000)).toBe('₹78 L');
    expect(formatINR(9500000)).toBe('₹95 L');
  });
  it('formats small amounts with Indian grouping', () => {
    expect(formatINR(50000)).toBe('₹50,000');
  });
});

describe('formatArea', () => {
  it('formats sqft', () => {
    expect(formatArea(1250)).toBe('1,250 sq ft');
  });
});
