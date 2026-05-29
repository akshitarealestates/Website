import Image from 'next/image';
import Link from 'next/link';
import { listFeatured, listLocalities, listBlogPosts } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { PropertyCard } from '@/components/property/property-card';
import { SearchBar } from '@/components/property/search-bar';
import { ArrowRight } from 'lucide-react';

const VERTICALS = [
  {
    href: '/properties?category=commercial',
    label: 'Commercial',
    blurb: 'Grade-A offices, showrooms, and warehouses across Lucknow\'s prime business corridors.',
    imageIndex: 9,
    imageAlt: 'Commercial office space in Lucknow',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    href: '/properties?category=resell',
    label: 'Resell',
    blurb: 'Verified resale homes in established neighbourhoods — clear titles, immediate possession.',
    imageIndex: 4,
    imageAlt: 'Resale home in Lucknow',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
  },
  {
    href: '/properties?category=premium_project',
    label: 'Premium Projects',
    blurb: 'RERA-registered new developments by Lucknow\'s top builders — from ₹70L to ₹5 Cr+.',
    imageIndex: 7,
    imageAlt: 'Premium residential project in Lucknow',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HomePage() {
  const featured = listFeatured(6);
  const localities = listLocalities();
  const posts = listBlogPosts({ publishedOnly: true }).slice(0, 3);
  const heroProperty = featured[0];
  const heroImage = heroProperty?.images[0]?.url ??
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80';

  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden">
        {/* Background image */}
        <Image
          src={heroImage}
          alt="Premium real estate in Lucknow"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink/80" />

        {/* Hero content */}
        <div className="relative z-10 pb-16 pt-32">
          <Container>
            <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-4">
              Lucknow · Premium Real Estate
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white md:text-7xl max-w-3xl">
              Redefining<br />
              <em className="italic font-normal">modern living</em>
            </h1>
            <p className="mt-6 max-w-xl text-white/80 text-base md:text-lg leading-relaxed">
              Curated commercial spaces, resale homes, and premium projects across Lucknow — each one verified, priced fairly, and matched to your life.
            </p>

            {/* Search bar */}
            <div className="mt-10 max-w-3xl">
              <SearchBar localities={localities} />
            </div>
          </Container>
        </div>
      </section>

      {/* ── 2. ABOUT STRIP ────────────────────────────────────────────── */}
      <section className="py-20 bg-cream border-b border-black/5">
        <Container>
          <p className="max-w-4xl text-2xl md:text-4xl font-display font-semibold leading-snug text-ink">
            Akshita Realty handles all types of property transactions across Lucknow, offering each client a{' '}
            <em className="italic font-normal">seamless</em> and{' '}
            <em className="italic font-normal">personalised</em> experience.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-gold transition-colors"
            >
              Our story <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink transition-colors"
            >
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── 3. STATS BAND ─────────────────────────────────────────────── */}
      <section className="bg-ink text-white py-16">
        <Container>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {[
              { value: '2012', label: 'Year founded' },
              { value: String(localities.length), label: 'Localities covered' },
              { value: '40+', label: 'Specialists' },
              { value: '2,600+', label: 'Happy buyers' },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="font-display text-5xl font-semibold text-gold">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. THREE VERTICALS ────────────────────────────────────────── */}
      <section className="py-24 bg-cream">
        <Container>
          <SectionHeading
            overline="What we offer"
            title="Find your fit"
            italicWord="fit"
            className="mb-12"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {VERTICALS.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                className="group relative overflow-hidden rounded-3xl bg-ink text-white aspect-[3/4] flex flex-col justify-end"
              >
                <Image
                  src={v.imageUrl}
                  alt={v.imageAlt}
                  fill
                  className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="relative z-10 p-8">
                  <p className="font-display text-2xl font-semibold mb-2">{v.label}</p>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">{v.blurb}</p>
                  <span className="inline-flex items-center gap-1.5 text-gold text-sm font-medium group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. FEATURED PROPERTIES ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <SectionHeading
              overline="Handpicked for you"
              title="Best properties"
              italicWord="properties"
            />
            <Link
              href="/properties"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink transition-colors"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p className="text-ink/50 text-center py-12">No featured properties at this time.</p>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-gold transition-colors"
            >
              View all properties <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── 6. PROPERTY MANAGEMENT ────────────────────────────────────── */}
      <section className="bg-ink text-white py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden order-last md:order-first">
              <Image
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
                alt="Property management services"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Copy */}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky mb-4">Our services</p>
              <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
                Property <em className="italic font-normal">management</em>
              </h2>
              <p className="mt-6 text-white/70 leading-relaxed">
                Let Akshita Realty handle everything — from tenant screening and rent collection to routine maintenance and legal compliance. We protect your investment so you can focus on what matters.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  'Tenant sourcing & background checks',
                  'Rent collection & legal rent deeds',
                  'Maintenance coordination & inspections',
                  'RERA & legal compliance support',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/services"
                className="mt-8 inline-flex items-center gap-2 text-gold text-sm font-medium hover:gap-4 transition-all"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 7. INSIGHTS TEASER ────────────────────────────────────────── */}
      <section className="py-24 bg-cream">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <SectionHeading
              overline="From the team"
              title="From our insights"
              italicWord="insights"
            />
            <Link
              href="/insights"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink transition-colors"
            >
              All articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/insights/${post.slug}`}
                className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.coverUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/60 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <p className="mt-3 text-xs text-gold font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read article <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 8. CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-black/5">
        <Container className="text-center">
          <SectionHeading
            title="Ready to find your place?"
            className="mx-auto max-w-2xl [&_h2]:text-center"
          />
          <p className="mt-5 text-ink/60 max-w-lg mx-auto">
            Browse our full collection or speak with a specialist — we&apos;re here to make your property journey seamless.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-8 py-3 text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              Browse properties <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 text-ink px-8 py-3 text-sm font-medium hover:border-ink/50 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
