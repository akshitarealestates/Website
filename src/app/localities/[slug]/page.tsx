import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getLocalityBySlug,
  listLocalities,
  listPropertiesByLocality,
} from '@/lib/data/repo';
import Image from 'next/image';
import { MapPin, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { PropertyCard } from '@/components/property/property-card';
import { imageFor } from '@/lib/data/images';

export function generateStaticParams() {
  return listLocalities().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locality = getLocalityBySlug(slug);

  if (!locality) {
    return { title: 'Locality not found — Akshita Realty' };
  }

  return {
    title: `${locality.name} Real Estate — Akshita Realty`,
    description: locality.description.slice(0, 160),
  };
}

export default async function LocalityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locality = getLocalityBySlug(slug);

  if (!locality) {
    notFound();
  }

  const properties = listPropertiesByLocality(slug);

  return (
    <main className="bg-cream pb-24">
      {/* Hero */}
      <section className="bg-cream pt-16 md:pt-20">
        <Container>
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-soft shadow-[0_4px_14px_-8px_rgba(43,33,24,0.4)]">
                <MapPin className="h-3.5 w-3.5 text-gold-deep" />
                {locality.city}
              </p>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-ink md:text-6xl">
                {locality.name}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                {locality.description}
              </p>
            </div>

            {/* Hero image collage */}
            <div className="relative aspect-[5/4] w-full">
              <div className="absolute right-0 top-0 h-[78%] w-[80%] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-28px_rgba(43,33,24,0.5)]">
                <Image
                  src={imageFor(locality.slug, 0)}
                  alt={`${locality.name} neighbourhood`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  priority
                />
              </div>
              <div className="absolute bottom-0 left-0 h-[48%] w-[46%] overflow-hidden rounded-[1.5rem] border-[5px] border-cream shadow-[0_24px_56px_-22px_rgba(43,33,24,0.5)]">
                <Image
                  src={imageFor(locality.slug, 6)}
                  alt={`Living in ${locality.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 46vw, 18vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="pt-16">
        {/* Insights card */}
        <section className="rounded-[2rem] bg-sky/35 p-7 sm:p-10">
          <div className="grid gap-8 md:grid-cols-[1.6fr_1fr] md:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">
                Locality insights
              </p>
              <p className="mt-3 leading-relaxed text-ink-soft">{locality.aiInsights}</p>
            </div>
            <div className="rounded-[1.5rem] bg-surface p-6 shadow-[0_18px_44px_-28px_rgba(43,33,24,0.4)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                <TrendingUp className="h-5 w-5" />
              </span>
              <p className="mt-4 text-xs uppercase tracking-wider text-sand-muted">Average price</p>
              <p className="mt-1 font-display text-3xl font-semibold text-ink">
                ₹{locality.avgPricePerSqft.toLocaleString('en-IN')}
                <span className="font-sans text-base font-normal text-sand-muted"> /sq ft</span>
              </p>
            </div>
          </div>
        </section>

        {/* Properties */}
        <section className="mt-20">
          <SectionHeading
            title={`Properties in ${locality.name}`}
            italicWord={locality.name}
          />

          {properties.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <PropertyCard key={p.slug} property={p} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-black/5 bg-surface p-14 text-center shadow-[0_18px_48px_-32px_rgba(43,33,24,0.4)]">
              <p className="font-display text-xl font-semibold text-ink">
                No listings here yet
              </p>
              <p className="mt-2 text-sand-muted">
                We don&apos;t have active properties in {locality.name} right now. Check back soon.
              </p>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
