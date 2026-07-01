'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import type { Role } from '@/lib/auth/roles';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

interface HeaderUser {
  role: Role;
  fullName: string;
}

interface HeaderShellProps {
  user: HeaderUser | null;
}

const NAV: { href: string; label: string }[] = [
  { href: '/properties', label: 'Properties' },
  { href: '/investment-planner', label: 'Investment AI' },
  { href: '/valuation', label: 'Valuation' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const PROPERTY_MENU: { href: string; label: string }[] = [
  { href: '/properties', label: 'All Properties' },
  { href: '/properties?category=commercial', label: 'Commercial' },
  { href: '/properties?category=resell', label: 'Resell' },
  { href: '/properties?category=premium_project', label: 'Premium Projects' },
];

export function HeaderShell({ user }: HeaderShellProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Solid styling everywhere except over the home hero (until scrolled).
  const solid = scrolled || !isHome;

  // Text/icon color depending on state.
  const onDark = !solid; // transparent over hero → light text

  return (
    <>
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'fixed inset-x-0 top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter,border-color] duration-500',
        solid
          ? 'border-b border-ink/8 bg-cream-warm/85 backdrop-blur-md shadow-[0_1px_24px_-12px_rgba(43,33,24,0.35)]'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        {/* Logo lockup */}
        <Link
          href="/"
          aria-label="Akshita Real Estate — home"
          className="group flex items-center transition-transform duration-500 ease-luxe hover:scale-[1.02]"
        >
          <Image
            src={onDark ? '/logo-white.png' : '/logo.png'}
            alt="Akshita Real Estate"
            width={997}
            height={669}
            priority
            className="h-11 w-auto md:h-12"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) =>
            item.label === 'Properties' ? (
              <div key={item.href} className="group relative">
                <NavLink href={item.href} label={item.label} onDark={onDark} />
                {/* Dropdown */}
                <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="min-w-[200px] overflow-hidden rounded-2xl border border-ink/8 bg-cream-warm/95 p-1.5 shadow-[0_16px_48px_-16px_rgba(43,33,24,0.45)] backdrop-blur-md">
                    {PROPERTY_MENU.map((m) => (
                      <Link
                        key={m.label}
                        href={m.href}
                        className="block rounded-xl px-3.5 py-2 text-sm text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
                      >
                        {m.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                onDark={onDark}
              />
            ),
          )}
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-5 md:flex">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className={[
                    'text-[0.7rem] uppercase tracking-[0.18em] transition-colors',
                    onDark
                      ? 'text-white/70 hover:text-white'
                      : 'text-ink/60 hover:text-ink',
                  ].join(' ')}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className={[
                  'text-[0.7rem] uppercase tracking-[0.18em] transition-colors',
                  onDark
                    ? 'text-white/80 hover:text-white'
                    : 'text-ink/70 hover:text-ink',
                ].join(' ')}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className={[
                'text-[0.7rem] uppercase tracking-[0.18em] transition-colors',
                onDark
                  ? 'text-white/80 hover:text-white'
                  : 'text-ink/60 hover:text-ink',
              ].join(' ')}
            >
              Sign in
            </Link>
          )}

          <CtaPill onDark={onDark} />
        </div>

        {/* Mobile trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className={[
                'inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                onDark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink/5',
              ].join(' ')}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[86vw] max-w-sm border-l border-black/5 bg-cream-warm"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <Image
                    src="/logo.png"
                    alt="Akshita Real Estate"
                    width={997}
                    height={669}
                    className="h-10 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-4 flex flex-col px-2">
                {PROPERTY_MENU.concat(
                  NAV.filter((n) => n.label !== 'Properties'),
                ).map((item) => (
                  <SheetClose
                    key={item.label}
                    render={
                      <Link
                        href={item.href}
                        className="border-b border-black/5 py-3.5 font-display text-base text-ink/85 transition-colors hover:text-gold-deep"
                      >
                        {item.label}
                      </Link>
                    }
                  />
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-3 px-2">
                <SheetClose
                  render={
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-deep"
                    >
                      Enquire
                    </Link>
                  }
                />
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <SheetClose
                        render={
                          <Link
                            href="/admin"
                            className="text-center text-sm text-ink/60 transition-colors hover:text-ink"
                          >
                            Admin
                          </Link>
                        }
                      />
                    )}
                    <SheetClose
                      render={
                        <Link
                          href="/dashboard"
                          className="text-center text-sm text-ink/70 transition-colors hover:text-ink"
                        >
                          Dashboard
                        </Link>
                      }
                    />
                  </>
                ) : (
                  <SheetClose
                    render={
                      <Link
                        href="/login"
                        className="text-center text-sm text-ink/60 transition-colors hover:text-ink"
                      >
                        Sign in
                      </Link>
                    }
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>

      {/* Spacer: on non-home routes the header is fixed & solid, so reserve
          its height to prevent content sliding underneath. On home, the hero
          sits full-bleed behind the transparent header (no spacer). */}
      {!isHome && <div aria-hidden className="h-[73px] w-full" />}
    </>
  );
}

function NavLink({
  href,
  label,
  onDark,
}: {
  href: string;
  label: string;
  onDark: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        'group/nav relative text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors',
        onDark ? 'text-white/85 hover:text-white' : 'text-ink/70 hover:text-ink',
      ].join(' ')}
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-luxe group-hover/nav:scale-x-100" />
    </Link>
  );
}

function CtaPill({ onDark }: { onDark: boolean }) {
  return (
    <Link
      href="/contact"
      className={[
        'group relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-all duration-300',
        onDark
          ? 'bg-white/95 text-ink hover:bg-white'
          : 'bg-ink text-cream hover:bg-charcoal',
      ].join(' ')}
    >
      <span className="relative z-10">Enquire</span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/30 to-transparent transition-transform duration-700 ease-luxe group-hover:translate-x-full" />
    </Link>
  );
}
