import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

const NAV = [
  { href: '/properties?category=commercial', label: 'Commercial' },
  { href: '/properties?category=resell', label: 'Resell' },
  { href: '/properties?category=premium_project', label: 'Premium Projects' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
];

async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null; // Supabase not configured yet
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}

export async function SiteHeader() {
  const user = await getUser();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          Akshita <span className="italic font-normal">Realty</span>
        </Link>
        <nav className="hidden gap-7 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-ink/80 hover:text-ink">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="text-sm">Dashboard</Link>
          ) : (
            <Link href="/login" className="rounded-full bg-ink px-4 py-2 text-sm text-white">Log in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
