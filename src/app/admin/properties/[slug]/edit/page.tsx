import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getPropertyBySlug, listLocalities } from '@/lib/data/repo';
import { PropertyForm } from '@/components/admin/property-form';
import { updatePropertyAction } from '../../actions';

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const localities = listLocalities();
  const action = updatePropertyAction.bind(null, slug);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
        >
          <ChevronLeft className="size-4" /> Back to properties
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Edit property</h1>
        <p className="text-sm text-ink/50">{property.title}</p>
      </div>

      <PropertyForm initial={property} localities={localities} action={action} />
    </div>
  );
}
