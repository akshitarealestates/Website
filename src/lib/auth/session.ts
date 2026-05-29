import { createClient } from '@/lib/supabase/server';
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
    const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single();
    return {
      id: user.id,
      email: user.email ?? '',
      fullName: profile?.full_name ?? user.email ?? 'User',
      role: (profile?.role as Role) ?? 'buyer',
      isDemo: false,
    };
  } catch { return null; }
}
