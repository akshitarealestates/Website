import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { AdminNav } from '@/components/admin/admin-nav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="bg-ink text-cream lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
        <div className="flex flex-col gap-6 px-5 py-6 lg:h-full">
          <Link href="/admin" className="flex flex-col">
            <span className="font-display text-xl font-semibold tracking-tight">
              Akshita <span className="text-gold">Real Estate</span>
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-cream/50">
              Admin
            </span>
          </Link>

          <AdminNav />

          <div className="hidden border-t border-white/10 pt-4 text-xs text-cream/50 lg:block">
            <p className="font-medium text-cream/80">{user.fullName}</p>
            <p className="truncate">{user.email}</p>
          </div>
        </div>
      </aside>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
