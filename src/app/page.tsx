import Image from 'next/image';
import Link from 'next/link';
import { listFeatured, listLocalities, listBlogPosts } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { ListingCard } from '@/components/property/listing-card';
import { IconButton } from '@/components/ui-kit/icon-button';
import { Hero } from '@/components/home/hero';
import { TrustBand } from '@/components/home/trust-band';
import { Testimonials } from '@/components/home/testimonials';
import { AboutCollage } from '@/components/home/about-collage';
import { Verticals } from '@/components/home/verticals';
import { PropertyManagement } from '@/components/home/property-management';
import { Reveal } from '@/components/ui-kit/reveal';
import { ArrowRight, ArrowUpRight, Sparkles, TrendingUp, LineChart, MessageSquare } from 'lucide-react';

const VERTICALS = [
  {
    href: '/properties?category=premium_project',
    label: 'Premium Projects',
    blurb: 'RERA-registered new developments by Lucknow\'s top builders — from ₹70L to ₹5 Cr+.',
    imageAlt: 'Premium residential project in Lucknow',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  },
  {
    href: '/properties?category=commercial',
    label: 'Commercial',
    blurb: 'Grade-A offices, showrooms, and warehouses across Lucknow\'s prime business corridors.',
    imageAlt: 'Commercial office space in Lucknow',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
  },
  {
    href: '/properties?category=resell',
    label: 'Resell',
    blurb: 'Verified resale homes in established neighbourhoods — clear titles, immediate possession.',
    imageAlt: 'Resale home in Lucknow',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
  },
];

const STATS = [
  { value: '2012', label: 'Year founded' },
  { value: '40+', label: 'Specialists' },
  { value: '2,600+', label: 'Happy buyers' },
];

export default function HomePage() {
  const featured = listFeatured(6);
  const localities = listLocalities();
  const posts = listBlogPosts({ publishedOnly: true }).slice(0, 3);

  const stats = [
    STATS[0],
    { value: String(localities.length), label: 'Localities covered' },
    STATS[1],
    STATS[2],
  ];

  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────────────── */}
      <Hero
        localities={localities.map((l) => ({ name: l.name, slug: l.slug }))}
      />

      {/* ── 2. ABOUT STRIP (collage) ──────────────────────────────────── */}
      <AboutCollage />

      {/* ── 2b. TRUST BAND ────────────────────────────────────────────── */}
      <TrustBand />

      {/* ── 3. STATS BAND ─────────────────────────────────────────────── */}
      <section className="bg-charcoal py-20 text-white md:py-24">
        <Container>
          <Reveal>
            <div className="grid grid-cols-2 divide-y divide-white/10 md:grid-cols-4 md:divide-x md:divide-y-0">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="px-2 py-6 text-center md:px-8 md:py-2 md:text-left"
                >
                  <p className="font-display text-5xl font-semibold text-gold md:text-6xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-white/55">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 4. THREE VERTICALS ────────────────────────────────────────── */}
      <Verticals verticals={VERTICALS} />

      {/* ── 5. FEATURED PROPERTIES ────────────────────────────────────── */}
      <section className="bg-cream py-24 md:py-28">
        <Container>
          <Reveal>
            <div className="mb-12 flex items-end justify-between">
              <SectionHeading
                overline="Handpicked for you"
                title="Best properties"
                italicWord="properties"
              />
              <Link
                href="/properties"
                aria-label="View all properties"
                className="group hidden items-center gap-3 md:inline-flex"
              >
                <span className="text-sm font-medium text-ink/60 transition-colors group-hover:text-ink">
                  View all
                </span>
                <IconButton
                  variant="outline"
                  className="transition-transform duration-300 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>

          {featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property, i) => (
                <Reveal
                  key={property.id}
                  delay={(i % 3) * 0.08}
                  className={i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}
                >
                  <ListingCard property={property} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-ink/50">No featured properties at this time.</p>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/40"
            >
              View all properties <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>


      {/* ── AI SUITE SHOWCASE ─────────────────────────────────────────── */}
      <section className="bg-ink text-white py-24 md:py-28 relative overflow-hidden">
        {/* Glowing background meshes */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

        <Container className="relative z-10">
          <Reveal>
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Akshita AI Ecosystem</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight text-white">
                Smarter decisions driven by <em className="italic font-light text-gold">advanced intelligence</em>
              </h2>
              <p className="mt-6 text-white/60 text-sm md:text-base leading-relaxed">
                We combine local Lucknow real estate mastery with bleeding-edge technology. Experience real estate built for the modern investor.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Smart Search */}
            <Reveal delay={0.05} className="h-full">
              <div className="group h-full flex flex-col justify-between rounded-3xl bg-white/5 border border-white/10 p-8 transition-all duration-300 hover:border-gold/30 hover:bg-white/10">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold mb-6 transition-transform group-hover:scale-105">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">Smart AI Search</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Search properties using natural, conversational language. No complex filters—simply state what you desire.
                  </p>
                </div>
                <Link
                  href="/"
                  className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold hover:text-white transition-colors"
                >
                  Try Smart Search
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            {/* Card 2: AI Investment Planner */}
            <Reveal delay={0.1} className="h-full">
              <div className="group h-full flex flex-col justify-between rounded-3xl bg-white/5 border border-gold/35 p-8 transition-all duration-300 hover:border-gold hover:bg-white/10 shadow-[0_4px_30px_rgba(176,135,91,0.08)]">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/30 text-gold mb-6 transition-transform group-hover:scale-105">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">AI Investment Planner</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Project compound capital growth over tenure, model Lucknow rental yields, and draft personalized strategic AI theses.
                  </p>
                </div>
                <Link
                  href="/investment-planner"
                  className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold hover:text-white transition-colors"
                >
                  Model Portfolio ROI
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            {/* Card 3: Instant Valuation */}
            <Reveal delay={0.15} className="h-full">
              <div className="group h-full flex flex-col justify-between rounded-3xl bg-white/5 border border-white/10 p-8 transition-all duration-300 hover:border-gold/30 hover:bg-white/10">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold mb-6 transition-transform group-hover:scale-105">
                    <LineChart className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">AI Market Valuer</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Obtain immediate data-backed valuation ranges for property assets in Lucknow based on live micro-market transaction registries.
                  </p>
                </div>
                <Link
                  href="/valuation"
                  className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold hover:text-white transition-colors"
                >
                  Estimate Value
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            {/* Card 4: 24/7 AI Concierge */}
            <Reveal delay={0.2} className="h-full">
              <div className="group h-full flex flex-col justify-between rounded-3xl bg-white/5 border border-white/10 p-8 transition-all duration-300 hover:border-gold/30 hover:bg-white/10">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold mb-6 transition-transform group-hover:scale-105">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">24/7 AI Concierge</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Engage with our digital expert to identify listings, answer complex regional queries, and orchestrate site inspections.
                  </p>
                </div>
                <div className="mt-8 text-xs font-semibold uppercase tracking-wider text-gold">
                  Available in Chat Widget
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── 6. PROPERTY MANAGEMENT ────────────────────────────────────── */}
      <PropertyManagement />

      {/* ── 7. INSIGHTS TEASER ────────────────────────────────────────── */}
      <section className="bg-surface py-24 md:py-28">
        <Container>
          <Reveal>
            <div className="mb-12 flex items-end justify-between">
              <SectionHeading
                overline="From the team"
                title="From our insights"
                italicWord="insights"
              />
              <Link
                href="/insights"
                className="hidden items-center gap-2 text-sm font-medium text-ink/60 transition-colors hover:text-ink md:inline-flex"
              >
                All articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.08} className="h-full">
                <Link
                  href={`/insights/${post.slug}`}
                  className="group block h-full overflow-hidden rounded-3xl bg-cream-warm p-3 shadow-[0_10px_30px_rgba(43,33,24,0.07)] transition-all duration-500 ease-luxe hover:-translate-y-1.5 hover:shadow-[0_18px_44px_rgba(43,33,24,0.13)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <Image
                      src={post.coverUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.06]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="px-2.5 pb-2 pt-4">
                    <h3 className="line-clamp-2 font-display text-lg font-medium leading-snug text-ink">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-sand-muted">
                      {post.excerpt}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold-deep transition-all group-hover:gap-2">
                      Read article <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7b. TESTIMONIALS ──────────────────────────────────────────── */}
      <Testimonials />

      {/* ── 8. CTA ────────────────────────────────────────────────────── */}
      <section className="bg-cream py-28">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-center text-cream md:px-16 md:py-20">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-gold">
                Get started
              </p>
              <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight md:text-5xl">
                Ready to find your <em className="font-normal italic text-gold">place</em>?
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-cream/65">
                Browse our full collection or speak with a specialist — we&apos;re
                here to make your property journey seamless.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold-deep"
                >
                  Browse properties <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/valuation"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cream-warm px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-white"
                >
                  What&apos;s my property worth?
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 px-8 py-3.5 text-sm font-medium text-cream transition-colors hover:border-cream/60"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
