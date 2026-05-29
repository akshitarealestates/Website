import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { listLocalities } from '@/lib/data/repo';
import { DeleteLocalityButton } from '@/components/admin/delete-locality-button';

export default function AdminLocalitiesPage() {
  const localities = listLocalities();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Localities</h1>
          <p className="mt-1 text-sm text-ink/60">
            {localities.length} {localities.length === 1 ? 'locality' : 'localities'}
          </p>
        </div>
        <Link
          href="/admin/localities/new"
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90"
        >
          <Plus className="size-4" /> New locality
        </Link>
      </header>

      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Avg price / sq ft</th>
                <th className="px-4 py-3 font-medium">Lat</th>
                <th className="px-4 py-3 font-medium">Lng</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {localities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-ink/50">
                    No localities yet.
                  </td>
                </tr>
              ) : (
                localities.map((loc) => (
                  <tr key={loc.id} className="hover:bg-black/[0.015]">
                    <td className="px-4 py-3 font-medium text-ink">{loc.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink/60">{loc.slug}</td>
                    <td className="px-4 py-3 text-ink/70">{loc.city}</td>
                    <td className="px-4 py-3 font-medium text-ink">
                      ₹{loc.avgPricePerSqft.toLocaleString('en-IN')}/sq ft
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink/60">
                      {loc.latitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink/60">
                      {loc.longitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/localities/${loc.slug}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-black/5"
                        >
                          <Pencil className="size-3.5" /> Edit
                        </Link>
                        <DeleteLocalityButton slug={loc.slug} name={loc.name} />
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
