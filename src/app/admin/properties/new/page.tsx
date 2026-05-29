import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { listLocalities } from '@/lib/data/repo';
import { PropertyForm } from '@/components/admin/property-form';
import { createPropertyAction } from '../actions';

export default function NewPropertyPage() {
  const localities = listLocalities();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
        >
          <ChevronLeft className="size-4" /> Back to properties
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">New property</h1>
      </div>

      <PropertyForm localities={localities} action={createPropertyAction} />
    </div>
  );
}
