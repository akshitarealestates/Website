export type Role = 'buyer' | 'seller' | 'admin';

export function isAdmin(role: Role | null | undefined): boolean {
  return role === 'admin';
}

export function canSell(role: Role | null | undefined): boolean {
  return role === 'seller' || role === 'admin';
}
