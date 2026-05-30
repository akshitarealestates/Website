import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getPropertyBySlug,
  listSimilar,
  getLocalityBySlug,
  listProperties,
} from '@/lib/data/repo';
import { formatINR, formatArea } from '@/lib/format';
import {
  BedDouble,
  Bath,
  Ruler,
  Sofa,
  Building2,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { PropertyCard } from '@/components/property/property-card';
import { Gallery } from '@/components/property/gallery';
import { EmiCalculator } from '@/components/property/emi-calculator';
import { EnquiryForm } from '@/components/property/enquiry-form';
import { FavoriteButton } from '@/components/property/favorite-button';
import type { LucideIcon } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  commercial: 'Commercial',
  resell: 'Resell',
  premium_project: 'Premium Project',
};

const WHATSAPP_NUMBER = '919999999999';

export function generateStaticParams() {
  return listProperties().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return { title: 'Property not found — Akshita Realty' };
  }

  return {
    title: `${property.title} — Akshita Realty`,
    description: property.description.slice(0, 160),
  };
}

function localityName(slug: string): string {
  const loc = getLocalityBySlug(slug);
  if (loc) return loc.name;
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** A single airy key-fact: icon + value + label, no box. */
function KeyFact({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky/50 text-gold-deep">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-base font-semibold leading-tight text-ink">{value}</p>
        <p className="text-xs uppercase tracking-wider text-sand-muted">{label}</p>
      </div>
    </div>
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property || (property.status !== 'published' && property.status !== 'pending')) {
    notFound();
  }

  const isRent = property.listingType === 'rent';
  const locality = getLocalityBySlug(property.localitySlug);
  const similar = listSimilar(property);

  const stats: { label: string; value: string; icon: LucideIcon }[] = [];
  if (property.bhk != null)
    stats.push({ label: 'Configuration', value: `${property.bhk} BHK`, icon: BedDouble });
  if (property.bathrooms != null)
    stats.push({ label: 'Bathrooms', value: String(property.bathrooms), icon: Bath });
  if (property.carpetAreaSqft != null)
    stats.push({ label: 'Carpet area', value: formatArea(property.carpetAreaSqft), icon: Ruler });
  if (property.furnishing)
    stats.push({ label: 'Furnishing', value: property.furnishing, icon: Sofa });
  if (property.floor != null)
    stats.push({
      label: 'Floor',
      value: property.totalFloors != null ? `${property.floor} of ${property.totalFloors}` : String(property.floor),
      icon: Building2,
    });

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I'm interested in ${property.title} (${property.slug})`,
  )}`;

  const possessionLabel = property.project?.possessionDate
    ? new Date(property.project.possessionDate).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <main className="bg-white pb-20">
      <Container className="pt-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-ink/50">
          <Link href="/properties" className="hover:text-ink">Properties</Link>
          <span className="mx-2">/</span>
          <span className="text-ink/70">{property.title}</span>
        </nav>

        {/* Gallery */}
        <Gallery images={property.images} />

        {/* Two-column layout */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* ─── Main column ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header block */}
            <header>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-ink/90 px-3 py-1 text-xs font-medium text-white">
                  {CATEGORY_LABELS[property.category] ?? property.category}
                </span>
                <span className="rounded-full bg-sky/80 px-3 py-1 text-xs font-medium text-ink capitalize">
                  For {isRent ? 'Rent' : 'Sale'}
                </span>
                {property.reraId && (
                  <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-ink/60">
                    RERA: {property.reraId}
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
                {property.title}
              </h1>
              <p className="mt-2 text-ink/60">
                {localityName(property.localitySlug)}, {property.city}
              </p>

              <p className="mt-5 font-display text-4xl font-semibold text-ink">
                {formatINR(property.price)}
                {isRent && (
                  <span className="ml-1 font-sans text-base font-normal text-ink/50">/mo</span>
                )}
              </p>

              {stats.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-6 border-y border-black/8 py-6">
                  {stats.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-x-8">
                      {i > 0 && <span aria-hidden className="hidden h-10 w-px bg-black/8 sm:block" />}
                      <KeyFact icon={s.icon} value={s.value} label={s.label} />
                    </div>
                  ))}
                </div>
              )}
            </header>

            {/* Highlights */}
            {property.highlights.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold text-ink">Highlights</h2>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {property.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-sky/45 px-4 py-2 text-sm font-medium text-ink-soft"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink">About this property</h2>
              <div className="mt-4 space-y-4 text-ink/70 leading-relaxed">
                {property.description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold text-ink">Amenities</h2>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm text-ink-soft shadow-[0_4px_14px_-8px_rgba(43,33,24,0.4)]"
                    >
                      <Check className="h-3.5 w-3.5 text-gold-deep" />
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Premium project block */}
            {property.project && (
              <section className="rounded-[2rem] border border-black/5 bg-surface p-7 shadow-[0_18px_48px_-30px_rgba(43,33,24,0.4)] sm:p-9">
                <h2 className="font-display text-2xl font-semibold text-ink">Project details</h2>

                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink/50">Developer</p>
                    <p className="mt-0.5 text-sm font-medium text-ink">
                      {property.project.developerName}
                    </p>
                  </div>
                  {possessionLabel && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/50">Possession</p>
                      <p className="mt-0.5 text-sm font-medium text-ink">{possessionLabel}</p>
                    </div>
                  )}
                  {property.project.projectStatus && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/50">Status</p>
                      <p className="mt-0.5 text-sm font-medium text-ink">
                        {property.project.projectStatus}
                      </p>
                    </div>
                  )}
                  {property.project.totalUnits != null && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/50">Total units</p>
                      <p className="mt-0.5 text-sm font-medium text-ink">
                        {property.project.totalUnits}
                      </p>
                    </div>
                  )}
                </div>

                {property.project.configurations.length > 0 && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-black/5">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-ink/5 text-ink/60">
                        <tr>
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium">Size</th>
                          <th className="px-4 py-3 font-medium">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 bg-white">
                        {property.project.configurations.map((c) => (
                          <tr key={`${c.type}-${c.sizeSqft}`}>
                            <td className="px-4 py-3 font-medium text-ink">{c.type}</td>
                            <td className="px-4 py-3 text-ink/70">{formatArea(c.sizeSqft)}</td>
                            <td className="px-4 py-3 text-ink/70">{formatINR(c.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {property.project.amenitiesExtended.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {property.project.amenitiesExtended.map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-white px-3 py-1.5 text-xs text-ink/70"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={property.project.brochureUrl || '#'}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-ink/90"
                >
                  Download brochure
                  <span aria-hidden>↓</span>
                </a>
              </section>
            )}

            {/* Location + map */}
            {property.latitude != null && property.longitude != null && (
              <section>
                <h2 className="font-display text-2xl font-semibold text-ink">Location</h2>
                {property.address && (
                  <p className="mt-2 text-ink/70">{property.address}</p>
                )}
                <div className="mt-4 aspect-[16/9] overflow-hidden rounded-2xl border border-black/5">
                  <iframe
                    title={`Map of ${property.title}`}
                    src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&hl=en&z=15&output=embed`}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </section>
            )}

            {/* Locality insights */}
            {locality && (
              <section className="rounded-[2rem] bg-sky/35 p-7 sm:p-9">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">
                  Locality insights
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                  {locality.name}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{locality.aiInsights}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-sand-muted">Avg. price</p>
                    <p className="mt-0.5 font-display text-xl font-semibold text-ink">
                      ₹{locality.avgPricePerSqft.toLocaleString('en-IN')}
                      <span className="font-sans text-sm font-normal text-sand-muted"> /sq ft</span>
                    </p>
                  </div>
                  <Link
                    href={`/localities/${locality.slug}`}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-gold-deep"
                  >
                    Explore {locality.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </section>
            )}

            {/* EMI calculator */}
            <section className="rounded-[2rem] border border-black/5 bg-surface p-7 shadow-[0_18px_48px_-30px_rgba(43,33,24,0.4)] sm:p-9">
              <h2 className="font-display text-2xl font-semibold text-ink">EMI calculator</h2>
              <p className="mt-2 text-sand-muted">
                Estimate your monthly home loan payment for this property.
              </p>
              <div className="mt-5">
                <EmiCalculator price={property.price} />
              </div>
            </section>
          </div>

          {/* ─── Sticky enquiry panel ────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="space-y-4 lg:sticky lg:top-8">
              <div className="rounded-[2rem] border border-black/5 bg-surface p-7 shadow-[0_24px_60px_-30px_rgba(43,33,24,0.45)]">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold-deep">
                  Enquire now
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-ink">
                  Interested in this property?
                </h2>
                <p className="mt-1.5 text-sm text-sand-muted">
                  Share your details and our team will get back to you.
                </p>
                <div className="mt-5">
                  <EnquiryForm slug={property.slug} title={property.title} />
                </div>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <span aria-hidden>💬</span>
                  Chat on WhatsApp
                </a>

                <div className="mt-3">
                  <FavoriteButton slug={property.slug} />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <section className="mt-20">
            <SectionHeading title="Similar properties" italicWord="properties" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard key={p.slug} property={p} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
