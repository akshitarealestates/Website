import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getLocalityBySlug,
  listLocalities,
  listPropertiesByLocality,
} from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { PropertyCard } from '@/components/property/property-card';

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
    <main className="bg-white pb-20">
      {/* Hero */}
      <section className="bg-cream">
        <Container className="py-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
            {locality.city}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            {locality.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/70 leading-relaxed">
            {locality.description}
          </p>
        </Container>
      </section>

      <Container className="pt-12">
        {/* Insights card */}
        <section className="rounded-2xl bg-sky/30 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Locality insights</p>
          <p className="mt-3 text-ink/70 leading-relaxed">{locality.aiInsights}</p>
          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-ink/50">Average price</p>
            <p className="mt-0.5 font-display text-2xl font-semibold text-ink">
              ₹{locality.avgPricePerSqft.toLocaleString('en-IN')}
              <span className="text-base font-sans font-normal text-ink/50"> /sq ft</span>
            </p>
          </div>
        </section>

        {/* Properties */}
        <section className="mt-16">
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
            <div className="mt-8 rounded-2xl border border-dashed border-black/10 bg-cream/50 p-12 text-center">
              <p className="font-display text-xl font-semibold text-ink">
                No listings here yet
              </p>
              <p className="mt-2 text-ink/60">
                We don&apos;t have active properties in {locality.name} right now. Check back soon.
              </p>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
