import Link from 'next/link';
import Image from 'next/image';
import type { Property } from '@/lib/data/types';
import { formatINR, formatArea } from '@/lib/format';

const CATEGORY_LABELS: Record<string, string> = {
  commercial: 'Commercial',
  resell: 'Resell',
  premium_project: 'Premium',
};

const CATEGORY_COLORS: Record<string, string> = {
  commercial: 'bg-sky/80 text-ink',
  resell: 'bg-gold/80 text-white',
  premium_project: 'bg-ink/80 text-white',
};

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images[0];
  const isRent = property.listingType === 'rent';

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[property.category] ?? 'bg-ink/80 text-white'}`}>
            {CATEGORY_LABELS[property.category] ?? property.category}
          </span>
          <span className="rounded-full bg-white/80 backdrop-blur px-2.5 py-0.5 text-xs font-medium text-ink capitalize">
            {property.listingType === 'rent' ? 'Rent' : 'Sale'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p className="font-display text-2xl font-semibold text-ink">
          {formatINR(property.price)}
          {isRent && <span className="text-sm font-sans font-normal text-ink/60">/mo</span>}
        </p>

        {/* Title */}
        <h3 className="mt-1 text-sm font-medium text-ink line-clamp-2 leading-snug">
          {property.title}
        </h3>

        {/* Locality */}
        <p className="mt-1 text-xs text-ink/50 capitalize">
          {property.localitySlug.replace(/-/g, ' ')}
        </p>

        {/* Meta chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {property.bhk != null && (
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-ink/70">
              {property.bhk} BHK
            </span>
          )}
          {property.bathrooms != null && (
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-ink/70">
              {property.bathrooms} Bath
            </span>
          )}
          {property.carpetAreaSqft != null && (
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-ink/70">
              {formatArea(property.carpetAreaSqft)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
