import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ExternalLink, ClipboardList } from 'lucide-react';
import { listPendingProperties, listLocalities } from '@/lib/data/repo';
import { formatINR } from '@/lib/format';
import { RejectButton } from '@/components/admin/reject-button';
import { approveAction } from './actions';

const CATEGORY_LABELS: Record<string, string> = {
  commercial: 'Commercial',
  resell: 'Resell',
  premium_project: 'Premium Project',
};

const fmt = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' });

export default function ModerationPage() {
  const pending = listPendingProperties();
  const localities = listLocalities();
  const localityName = (slug: string) =>
    localities.find((l) => l.slug === slug)?.name ?? slug;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Moderation Queue
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {pending.length === 0
              ? 'No listings awaiting moderation.'
              : `${pending.length} ${pending.length === 1 ? 'listing' : 'listings'} awaiting review`}
          </p>
        </div>

        {pending.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
            <ClipboardList className="size-4" aria-hidden />
            {pending.length} pending
          </span>
        )}
      </header>

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 ring-1 ring-black/5">
          <CheckCircle className="mb-4 size-12 text-emerald-400" aria-hidden />
          <p className="text-base font-medium text-ink/60">
            No listings awaiting moderation.
          </p>
          <p className="mt-1 text-sm text-ink/40">
            All user-submitted properties have been reviewed.
          </p>
        </div>
      ) : (
        /* ── Cards ────────────────────────────────────────────────── */
        <div className="space-y-4">
          {pending.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5"
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                {/* Cover thumbnail */}
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-black/5 sm:h-20 sm:w-32">
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

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-500/20">
                      {CATEGORY_LABELS[p.category] ?? p.category}
                    </span>
                    <span className="text-xs text-ink/40">
                      Submitted {fmt.format(new Date(p.createdAt))}
                    </span>
                  </div>

                  <h2 className="truncate font-medium text-ink">{p.title}</h2>

                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-ink/60">
                    <span>{localityName(p.localitySlug)}</span>
                    <span className="font-medium text-ink">{formatINR(p.price)}</span>
                  </div>

                  {p.description && (
                    <p className="line-clamp-2 text-xs text-ink/50">{p.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <Link
                    href={`/properties/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:bg-black/5"
                  >
                    <ExternalLink className="size-3.5" />
                    Preview
                  </Link>

                  <form
                    action={approveAction.bind(null, p.slug)}
                    className="contents"
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                      <CheckCircle className="size-3.5" />
                      Approve
                    </button>
                  </form>

                  <RejectButton slug={p.slug} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
