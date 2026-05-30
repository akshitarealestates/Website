import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Bath, Ruler, MapPin, Star } from 'lucide-react';
import type { Property } from '@/lib/data/types';
import { formatINR, formatArea } from '@/lib/format';

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
      className="group block overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-[0_1px_2px_rgba(15,32,43,0.04)] transition-all duration-500 ease-luxe hover:-translate-y-1.5 hover:border-ink/10 hover:shadow-[0_24px_50px_-20px_rgba(15,32,43,0.28)]"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.07]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />

        {/* Top badges */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur-md">
            {CATEGORY_LABELS[property.category] ?? property.category}
          </span>
          {property.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink shadow-sm">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        {/* Listing type, bottom-left over scrim */}
        <span className="absolute bottom-3 left-3 rounded-full bg-ink/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
          For {isRent ? 'Rent' : 'Sale'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <p className="font-display text-2xl font-semibold leading-none text-ink">
          <span className="text-gold-deep">{formatINR(property.price)}</span>
          {isRent && <span className="ml-0.5 font-sans text-sm font-normal text-ink/50">/mo</span>}
        </p>

        {/* Title */}
        <h3 className="mt-2.5 line-clamp-2 font-display text-base font-medium leading-snug text-ink">
          {property.title}
        </h3>

        {/* Locality */}
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/55">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-deep/80" />
          <span className="capitalize">{locality}</span>
          <span className="text-ink/30">·</span>
          <span>{property.city}</span>
        </p>

        {/* Specs */}
        {(beds != null || property.bathrooms != null || property.carpetAreaSqft != null) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/5 pt-4 text-xs text-ink/70">
            {beds != null && (
              <span className="inline-flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-ink/40" />
                {beds} {property.category === 'commercial' ? 'Cabins' : 'BHK'}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="inline-flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-ink/40" />
                {property.bathrooms} Bath
              </span>
            )}
            {property.carpetAreaSqft != null && (
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="h-4 w-4 text-ink/40" />
                {formatArea(property.carpetAreaSqft)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
