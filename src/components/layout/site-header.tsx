import { getCurrentUser } from '@/lib/auth/session';
import { HeaderShell } from './header-shell';

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <HeaderShell
      user={user ? { role: user.role, fullName: user.fullName } : null}
    />
  );
}
