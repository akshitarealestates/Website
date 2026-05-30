import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CalendarClock, Layers } from 'lucide-react';
import type { Property } from '@/lib/data/types';
import { formatINR } from '@/lib/format';
import { projectStartingPrice, projectBhkRange } from '@/lib/data/repo';
import { IconButton } from '@/components/ui-kit/icon-button';

function possessionYear(dateStr?: string): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return String(d.getFullYear());
}

/**
 * A card tuned for a real-estate DEVELOPMENT (premium_project): developer,
 * project title, locality, a starting price, and pills for BHK range,
 * possession year and launch status.
 */
export function ProjectCard({ property }: { property: Property }) {
  const image = property.images[0];
  const project = property.project;
  const locality = property.localitySlug.replace(/-/g, ' ');

  const startingPrice = projectStartingPrice(property) ?? property.price;
  const bhkRange = projectBhkRange(property);
  const possession = possessionYear(project?.possessionDate);
  const launchStatus = project?.launchStatus ?? project?.projectStatus ?? null;

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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent" />

        {/* Top-left: New Launch / status pill */}
        <span className="absolute left-3 top-3 rounded-full bg-surface/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur">
          New Project
        </span>

        {/* Top-right: launch status */}
        {launchStatus && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm">
            {launchStatus}
          </span>
        )}

        {/* Bottom-left: starting price pill */}
        <span className="absolute bottom-3 left-3 inline-flex items-baseline gap-1 rounded-full bg-ink px-3.5 py-1.5 font-display text-sm font-semibold text-cream shadow-[0_6px_16px_-6px_rgba(43,33,24,0.5)]">
          <span className="font-sans text-[10px] font-normal uppercase tracking-wide text-cream/70">Starting</span>
          {formatINR(startingPrice)}
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
        {/* Developer */}
        {project?.developerName && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-deep/90">
            {project.developerName}
          </p>
        )}

        {/* Title */}
        <h3 className="mt-1 line-clamp-2 font-display text-base font-medium leading-snug text-ink">
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
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {bhkRange && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky/60 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
              <Layers className="h-3.5 w-3.5 text-gold-deep/80" />
              {bhkRange}
            </span>
          )}
          {possession && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky/60 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
              <CalendarClock className="h-3.5 w-3.5 text-gold-deep/80" />
              Possession {possession}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
