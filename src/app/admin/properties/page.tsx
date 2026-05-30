import Link from 'next/link';
import Image from 'next/image';
import { Plus, Star, Pencil } from 'lucide-react';
import { listAllProperties, listLocalities } from '@/lib/data/repo';
import { formatINR } from '@/lib/format';
import { StatusBadge } from '@/components/admin/status-badge';
import { DeletePropertyButton } from '@/components/admin/delete-property-button';
import type { PropertyCategory, PropertyStatus } from '@/lib/data/types';

type RawParams = Record<string, string | string[] | undefined>;

const CATEGORIES: { value: PropertyCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'resell', label: 'Resell' },
  { value: 'premium_project', label: 'Premium Project' },
];

const STATUSES: { value: PropertyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'published', label: 'Published' },
  { value: 'pending', label: 'Pending' },
  { value: 'draft', label: 'Draft' },
  { value: 'sold', label: 'Sold' },
  { value: 'rejected', label: 'Rejected' },
];

const VALID_CATEGORIES = new Set(['commercial', 'resell', 'premium_project']);
const VALID_STATUSES = new Set(['draft', 'pending', 'published', 'sold', 'rejected']);

function str(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function buildHref(base: RawParams, overrides: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const key of ['category', 'status']) {
    const v = str(base[key]);
    if (v) params.set(key, v);
  }
  for (const [k, v] of Object.entries(overrides)) {
    if (v && v !== 'all') params.set(k, v);
    else params.delete(k);
  }
  const qs = params.toString();
  return qs ? `/admin/properties?${qs}` : '/admin/properties';
}

const CATEGORY_LABELS: Record<PropertyCategory, string> = {
  commercial: 'Commercial',
  resell: 'Resell',
  premium_project: 'Premium Project',
};

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const raw = await searchParams;
  const categoryParam = str(raw.category);
  const statusParam = str(raw.status);

  const category =
    categoryParam && VALID_CATEGORIES.has(categoryParam)
      ? (categoryParam as PropertyCategory)
      : undefined;
  const status =
    statusParam && VALID_STATUSES.has(statusParam)
      ? (statusParam as PropertyStatus)
      : undefined;

  let properties = listAllProperties(category ? { category } : {});
  if (status) properties = properties.filter((p) => p.status === status);

  const localities = listLocalities();
  const localityName = (slug: string) =>
    localities.find((l) => l.slug === slug)?.name ?? slug;

  const activeCategory = category ?? 'all';
  const activeStatus = status ?? 'all';

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Properties</h1>
          <p className="mt-1 text-sm text-ink/60">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90"
        >
          <Plus className="size-4" /> New property
        </Link>
      </header>

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={buildHref(raw, { category: c.value })}
            aria-current={activeCategory === c.value ? 'true' : undefined}
            className={
              activeCategory === c.value
                ? 'rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-cream'
                : 'rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/60 hover:text-ink'
            }
          >
            {c.label}
          </Link>
        ))}
        <span className="mx-1 w-px self-stretch bg-black/10" />
        {STATUSES.map((s) => (
          <Link
            key={s.value}
            href={buildHref(raw, { status: s.value })}
            aria-current={activeStatus === s.value ? 'true' : undefined}
            className={
              activeStatus === s.value
                ? 'rounded-full bg-gold px-3 py-1.5 text-xs font-medium text-ink'
                : 'rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/60 hover:text-ink'
            }
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* ── Table ──────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="px-4 py-3 font-medium">Cover</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Locality</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-ink/50">
                    No properties match these filters.
                  </td>
                </tr>
              ) : (
                properties.map((p) => (
                  <tr key={p.id} className="hover:bg-black/[0.015]">
                    <td className="px-4 py-3">
                      <div className="relative h-10 w-14 overflow-hidden rounded-md bg-black/5">
                        {p.images[0]?.url && (
                          <Image
                            src={p.images[0].url}
                            alt={p.images[0].alt ?? p.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 font-medium text-ink">
                        {p.isFeatured && (
                          <Star className="size-3.5 shrink-0 fill-gold text-gold" aria-label="Featured" />
                        )}
                        {p.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{CATEGORY_LABELS[p.category]}</td>
                    <td className="px-4 py-3 text-ink/70">{localityName(p.localitySlug)}</td>
                    <td className="px-4 py-3 font-medium text-ink">{formatINR(p.price)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/properties/${p.slug}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-black/5"
                        >
                          <Pencil className="size-3.5" /> Edit
                        </Link>
                        <DeletePropertyButton slug={p.slug} title={p.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
