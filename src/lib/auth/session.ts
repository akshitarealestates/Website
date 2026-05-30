import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from './admin';
import type { Role } from './roles';

export interface SessionUser { id: string; email: string; fullName: string; role: Role; isDemo: boolean }

export async function getCurrentUser(): Promise<SessionUser | null> {
  if (process.env.NEXT_PUBLIC_DEMO_AUTH === 'true') {
    return { id: 'demo-admin', email: 'demo@akshita.test', fullName: 'Demo Admin', role: 'admin', isDemo: true };
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const admin = isAdminEmail(user.email);
    let fullName = user.email ?? 'User';
    let role: Role = admin ? 'admin' : 'buyer';

    // The `profiles` table may not exist yet on the linked DB. Never throw:
    // the allowlist already governs admin access, profiles only enriches it.
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();
      if (profile) {
        if (profile.full_name) fullName = profile.full_name;
        // Allowlist admins stay admin; otherwise adopt the stored role.
        if (!admin && profile.role) role = profile.role as Role;
      }
    } catch {
      // ignore — profiles table missing or unreachable
    }

    return { id: user.id, email: user.email ?? '', fullName, role, isDemo: false };
  } catch { return null; }
}
