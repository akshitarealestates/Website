import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Plus, ExternalLink, LayoutGrid } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';
import { listMyListings, listProperties, listLocalities } from '@/lib/data/repo';
import { formatINR } from '@/lib/format';
import { FavoritesList, type FavoriteEntry } from '@/components/dashboard/favorites-list';
import { RecommendedForYou } from '@/components/ai/recommended-for-you';

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  published: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  rejected: 'bg-red-100 text-red-700 ring-red-600/20',
  draft: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  sold: 'bg-ink/10 text-ink ring-black/10',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending review',
  published: 'Published',
  rejected: 'Rejected',
  draft: 'Draft',
  sold: 'Sold',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const myListings = listMyListings(user.id);
  const localities = listLocalities();
  const localityName = (slug: string) =>
    localities.find((l) => l.slug === slug)?.name ?? slug.replace(/-/g, ' ');

  const publishedProperties = listProperties();

  // Minimal projection of all published properties for the client favorites island.
  const favoriteMap: Record<string, FavoriteEntry> = {};
  for (const p of publishedProperties) {
    favoriteMap[p.slug] = {
      slug: p.slug,
      title: p.title,
      price: formatINR(p.price),
      locality: localityName(p.localitySlug),
      image: p.images[0]?.url ?? '',
    };
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gold">Dashboard</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
            Welcome, {user.fullName}
          </h1>
          <p className="mt-2 text-ink/60">
            Manage your listings, saved homes, and account in one place.
          </p>
        </div>
        <Link
          href="/sell"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90"
        >
          <Plus className="size-4" aria-hidden /> List a property
        </Link>
      </header>

      {/* ── My listings ──────────────────────────────────────────────── */}
      <div className="mt-12">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-5 text-ink/40" aria-hidden />
          <h2 className="font-display text-2xl font-semibold text-ink">My listings</h2>
          <span className="text-sm text-ink/40">({myListings.length})</span>
        </div>

        {myListings.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center ring-1 ring-black/5">
            <p className="text-base font-medium text-ink/70">You haven&apos;t listed any properties yet.</p>
            <p className="mt-1 text-sm text-ink/40">
              Submit a resell property and we&apos;ll review it before it goes live.
            </p>
            <Link
              href="/sell"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold/90"
            >
              <Plus className="size-4" aria-hidden /> List a property
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {myListings.map((p) => (
              <article
                key={p.id}
                className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/5 sm:flex-row sm:items-center"
              >
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-black/5 sm:h-20 sm:w-32">
                  {p.images[0]?.url && (
                    <Image
                      src={p.images[0].url}
                      alt={p.images[0].alt ?? p.title}
                      fill
                      sizes="(min-width:640px) 128px, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE[p.status] ?? STATUS_BADGE.draft}`}
                    >
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                    <span className="text-xs capitalize text-ink/40">
                      {localityName(p.localitySlug)}
                    </span>
                  </div>
                  <h3 className="truncate font-medium text-ink">{p.title}</h3>
                  <p className="font-display text-lg font-semibold text-ink">{formatINR(p.price)}</p>
                  {p.status === 'rejected' && p.rejectionReason && (
                    <p className="text-xs text-red-600">
                      Reason: {p.rejectionReason}
                    </p>
                  )}
                </div>

                {p.status === 'published' && (
                  <Link
                    href={`/properties/${p.slug}`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:bg-black/5"
                  >
                    <ExternalLink className="size-3.5" aria-hidden /> View
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ── Saved properties ─────────────────────────────────────────── */}
      <div className="mt-14">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-lg text-gold">♥</span>
          <h2 className="font-display text-2xl font-semibold text-ink">Saved properties</h2>
        </div>
        <div className="mt-4">
          <FavoritesList propertyMap={favoriteMap} />
        </div>
      </div>

      {/* ── Recommended for you ──────────────────────────────────────── */}
      <RecommendedForYou properties={publishedProperties} />

      {/* ── Account ──────────────────────────────────────────────────── */}
      <div className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-ink">Account</h2>
        <div className="mt-4 max-w-md rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/50">Email</dt>
              <dd className="font-medium text-ink">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/50">Role</dt>
              <dd className="font-medium capitalize text-ink">{user.role}</dd>
            </div>
          </dl>
          <form action="/auth/signout" method="post" className="mt-6">
            <button
              type="submit"
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-black/5"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
