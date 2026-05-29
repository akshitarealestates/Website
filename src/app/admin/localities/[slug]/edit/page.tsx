import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getLocalityBySlug } from '@/lib/data/repo';
import { LocalityForm } from '@/components/admin/locality-form';
import { updateLocalityAction } from '../../actions';

export default async function EditLocalityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locality = getLocalityBySlug(slug);
  if (!locality) notFound();

  const action = updateLocalityAction.bind(null, slug);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/localities"
          className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
        >
          <ChevronLeft className="size-4" /> Back to localities
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Edit locality</h1>
        <p className="text-sm text-ink/50">{locality.name}</p>
      </div>

      <LocalityForm initial={locality} action={action} />
    </div>
  );
}
