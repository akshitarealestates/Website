import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Bath, Ruler, MapPin, Star } from 'lucide-react';
import type { Property } from '@/lib/data/types';
import { formatINR, formatArea } from '@/lib/format';
import { IconButton } from '@/components/ui-kit/icon-button';

const CATEGORY_LABELS: Record<string, string> = {
  commercial: 'Commercial',
  resell: 'Resell',
  premium_project: 'Premium',
};

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images[0];
  const isRent = property.listingType === 'rent';
  const beds = property.bhk ?? property.bedrooms ?? null;
  const locality = property.localitySlug.replace(/-/g, ' ');

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex h-full flex-col rounded-[22px] bg-surface p-3 shadow-[0_10px_30px_rgba(43,33,24,0.08)] transition-all duration-500 ease-luxe hover:-translate-y-1.5 hover:shadow-[0_18px_44px_rgba(43,33,24,0.14)]"
    >
      {/* Floating cover image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.07]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Soft scrim only at the very bottom for pill legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent" />

        {/* Top-left: category pill */}
        <span className="absolute left-3 top-3 rounded-full bg-surface/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur">
          {CATEGORY_LABELS[property.category] ?? property.category}
        </span>

        {/* Top-right: Featured pill */}
        {property.isFeatured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </span>
        )}

        {/* Bottom-left: price pill */}
        <span className="absolute bottom-3 left-3 inline-flex items-baseline rounded-full bg-ink px-3.5 py-1.5 font-display text-sm font-semibold text-cream shadow-[0_6px_16px_-6px_rgba(43,33,24,0.5)]">
          {formatINR(property.price)}
          {isRent && <span className="ml-0.5 font-sans text-[11px] font-normal text-cream/70">/mo</span>}
        </span>

        {/* Bottom-right: circular arrow button */}
        <IconButton
          variant="gold"
          size="md"
          className="absolute bottom-3 right-3 transition-transform duration-300 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3.5">
        {/* Title */}
        <h3 className="line-clamp-2 font-display text-base font-medium leading-snug text-ink">
          {property.title}
        </h3>

        {/* Locality */}
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-sand-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-deep/80" />
          <span className="capitalize">{locality}</span>
          <span className="text-ink/25">·</span>
          <span>{property.city}</span>
        </p>

        {/* Spec pills */}
        {(beds != null || property.bathrooms != null || property.carpetAreaSqft != null) && (
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            {beds != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky/60 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                <BedDouble className="h-3.5 w-3.5 text-gold-deep/80" />
                {beds} {property.category === 'commercial' ? 'Cabins' : 'BHK'}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky/60 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                <Bath className="h-3.5 w-3.5 text-gold-deep/80" />
                {property.bathrooms} Bath
              </span>
            )}
            {property.carpetAreaSqft != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky/60 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                <Ruler className="h-3.5 w-3.5 text-gold-deep/80" />
                {formatArea(property.carpetAreaSqft)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
