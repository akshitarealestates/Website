import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isAdminEmail } from './admin';

describe('isAdminEmail', () => {
  const original = process.env.ADMIN_EMAILS;

  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'Admin@Akshita.test, owner@akshita.test';
  });

  afterEach(() => {
    process.env.ADMIN_EMAILS = original;
  });

  it('returns true for an email in the list (case-insensitive)', () => {
    expect(isAdminEmail('admin@akshita.test')).toBe(true);
    expect(isAdminEmail('ADMIN@AKSHITA.TEST')).toBe(true);
    expect(isAdminEmail('owner@akshita.test')).toBe(true);
  });

  it('returns false for an email not in the list', () => {
    expect(isAdminEmail('someone@else.com')).toBe(false);
  });

  it('returns false for empty, null, or undefined email', () => {
    expect(isAdminEmail('')).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it('returns false when ADMIN_EMAILS env is empty', () => {
    process.env.ADMIN_EMAILS = '';
    expect(isAdminEmail('admin@akshita.test')).toBe(false);
  });

  it('returns false when ADMIN_EMAILS env is unset', () => {
    delete process.env.ADMIN_EMAILS;
    expect(isAdminEmail('admin@akshita.test')).toBe(false);
  });
});
