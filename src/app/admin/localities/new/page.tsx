import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { LocalityForm } from '@/components/admin/locality-form';
import { createLocalityAction } from '../actions';

export default function NewLocalityPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/localities"
          className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
        >
          <ChevronLeft className="size-4" /> Back to localities
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">New locality</h1>
      </div>

      <LocalityForm action={createLocalityAction} />
    </div>
  );
}
