import Link from 'next/link';
import {
  Building2,
  CalendarClock,
  ShieldCheck,
  Layers,
  Home,
  Check,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Property, PropertyImage } from '@/lib/data/types';
import {
  getLocalityBySlug,
  listSimilar,
  projectStartingPrice,
  projectBhkRange,
} from '@/lib/data/repo';
import { formatINR } from '@/lib/format';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { Gallery } from '@/components/property/gallery';
import { EmiCalculator } from '@/components/property/emi-calculator';
import { ListingCard } from '@/components/property/listing-card';
import { ProjectEnquiryExperience } from '@/components/property/project-enquiry-experience';

function localityName(slug: string): string {
  const loc = getLocalityBySlug(slug);
  if (loc) return loc.name;
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function possessionLabel(dateStr?: string): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

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

export function ProjectDevelopment({ property }: { property: Property }) {
  const project = property.project!;
  const locality = getLocalityBySlug(property.localitySlug);
  const similar = listSimilar(property);

  const startingPrice = projectStartingPrice(property) ?? property.price;
  const bhkRange = projectBhkRange(property);
  const possession = possessionLabel(project.possessionDate);
  const launchStatus = project.launchStatus ?? project.projectStatus ?? null;

  // Build the gallery: project gallery URLs first, then the property images.
  const galleryImages: PropertyImage[] = [
    ...(project.gallery ?? []).map((url, i) => ({
      url,
      alt: `${property.title} — gallery ${i + 1}`,
    })),
    ...property.images,
  ];

  const reraId = project.reraId ?? property.reraId ?? null;

  const facts: { icon: LucideIcon; value: string; label: string }[] = [
    { icon: Building2, value: project.developerName, label: 'Developer' },
  ];
  if (possession) facts.push({ icon: CalendarClock, value: possession, label: 'Possession' });
  if (reraId) facts.push({ icon: ShieldCheck, value: reraId, label: 'RERA' });
  if (project.totalUnits != null)
    facts.push({ icon: Home, value: String(project.totalUnits), label: 'Total units' });
  if (project.projectStatus)
    facts.push({ icon: Layers, value: project.projectStatus, label: 'Status' });

  return (
    <main className="bg-white pb-20">
      <Container className="pt-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-ink/50">
          <Link href="/properties" className="hover:text-ink">Properties</Link>
          <span className="mx-2">/</span>
          <Link href="/properties?category=premium_project" className="hover:text-ink">
            Premium projects
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink/70">{property.title}</span>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink/90 px-3 py-1 text-xs font-medium text-white">
              New Project
            </span>
            {launchStatus && (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-medium text-white">
                {launchStatus}
              </span>
            )}
            {possession && (
              <span className="rounded-full bg-sky/80 px-3 py-1 text-xs font-medium text-ink">
                Possession {possession}
              </span>
            )}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
            {project.developerName}
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
            {property.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-ink/60">
            <MapPin className="h-4 w-4 text-gold-deep/80" />
            {localityName(property.localitySlug)}, {property.city}
          </p>

          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
            <p>
              <span className="block text-xs uppercase tracking-wider text-sand-muted">
                Starting from
              </span>
              <span className="font-display text-4xl font-semibold text-ink">
                {formatINR(startingPrice)}
              </span>
            </p>
            {bhkRange && (
              <p>
                <span className="block text-xs uppercase tracking-wider text-sand-muted">
                  Configurations
                </span>
                <span className="font-display text-2xl font-semibold text-ink">{bhkRange}</span>
              </p>
            )}
          </div>
        </header>

        {/* Gallery */}
        <Gallery images={galleryImages} />

        {/* ── Overview ────────────────────────────────────────────────── */}
        {(project.about || property.description) && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-ink">Overview</h2>
            <div className="mt-4 max-w-3xl space-y-4 leading-relaxed text-ink/70">
              {(project.about ?? property.description)
                .split('\n')
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          </section>
        )}

        {/* ── Key facts ───────────────────────────────────────────────── */}
        <section className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6 border-y border-black/8 py-7">
          {facts.map((f) => (
            <KeyFact key={f.label} icon={f.icon} value={f.value} label={f.label} />
          ))}
        </section>

        {/* ── Configurations & pricing + enquiry (client island) ──────── */}
        <section className="mt-14">
          <ProjectEnquiryExperience property={property} />
        </section>

        {/* ── Amenities ───────────────────────────────────────────────── */}
        {project.amenitiesExtended.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-ink">Amenities</h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {project.amenitiesExtended.map((a) => (
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

        {/* ── Location highlights + map ───────────────────────────────── */}
        {(project.locationHighlights?.length ||
          (property.latitude != null && property.longitude != null)) && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-ink">Location</h2>
            {property.address && <p className="mt-2 text-ink/70">{property.address}</p>}

            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              {project.locationHighlights && project.locationHighlights.length > 0 && (
                <ul className="space-y-3">
                  {project.locationHighlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-ink-soft">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky/60 text-gold-deep">
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {property.latitude != null && property.longitude != null && (
                <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-black/5">
                  <iframe
                    title={`Map of ${property.title}`}
                    src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&hl=en&z=15&output=embed`}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Locality insights ───────────────────────────────────────── */}
        {locality && (
          <section className="mt-16 rounded-[2rem] bg-sky/35 p-7 sm:p-9">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">
              Locality insights
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{locality.name}</h2>
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

        {/* ── EMI calculator ──────────────────────────────────────────── */}
        <section className="mt-16 rounded-[2rem] border border-black/5 bg-surface p-7 shadow-[0_18px_48px_-30px_rgba(43,33,24,0.4)] sm:p-9">
          <h2 className="font-display text-2xl font-semibold text-ink">EMI calculator</h2>
          <p className="mt-2 text-sand-muted">
            Estimate your monthly home loan payment from the starting price.
          </p>
          <div className="mt-5">
            <EmiCalculator price={startingPrice} />
          </div>
        </section>

        {/* ── Other projects ──────────────────────────────────────────── */}
        {similar.length > 0 && (
          <section className="mt-20">
            <SectionHeading title="Other projects" italicWord="projects" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <ListingCard key={p.slug} property={p} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
