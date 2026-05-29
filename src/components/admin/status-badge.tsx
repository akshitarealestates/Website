import { cn } from '@/lib/utils';
import type { PropertyStatus, Lead } from '@/lib/data/types';

const PROPERTY_STYLES: Record<PropertyStatus, string> = {
  published: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  pending: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  draft: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  sold: 'bg-sky-100 text-sky-800 ring-sky-600/20',
  rejected: 'bg-red-100 text-red-800 ring-red-600/20',
};

const LEAD_STYLES: Record<Lead['status'], string> = {
  new: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  contacted: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  closed: 'bg-slate-100 text-slate-700 ring-slate-500/20',
};

export function StatusBadge({
  status,
  kind = 'property',
  className,
}: {
  status: string;
  kind?: 'property' | 'lead';
  className?: string;
}) {
  const styles =
    kind === 'lead'
      ? LEAD_STYLES[status as Lead['status']]
      : PROPERTY_STYLES[status as PropertyStatus];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset',
        styles ?? 'bg-slate-100 text-slate-700 ring-slate-500/20',
        className,
      )}
    >
      {status}
    </span>
  );
}
