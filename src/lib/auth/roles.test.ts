import { describe, it, expect } from 'vitest';
import { isAdmin, canSell, type Role } from './roles';

describe('role guards', () => {
  it('isAdmin only true for admin', () => {
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('seller')).toBe(false);
    expect(isAdmin('buyer')).toBe(false);
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });
  it('canSell true for seller and admin', () => {
    const cases: [Role | null | undefined, boolean][] = [
      ['seller', true], ['admin', true], ['buyer', false], [null, false],
    ];
    for (const [role, expected] of cases) expect(canSell(role)).toBe(expected);
  });
});
