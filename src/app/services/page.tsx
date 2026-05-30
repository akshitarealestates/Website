import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services — Akshita Realty',
  description: 'Property buying, selling, resale assistance, property management, and RERA legal support in Lucknow.',
};

const SERVICES = [
  {
    title: 'Property Buying',
    icon: '🏠',
    description:
      'We help you identify the right property, negotiate the best price, and navigate the entire purchase process — from shortlisting to registration.',
    features: [
      'Personalised property matching',
      'Market valuation & price benchmarking',
      'Site visits & comparative analysis',
      'End-to-end transaction support',
    ],
  },
  {
    title: 'Property Selling',
    icon: '📈',
    description:
      'List your property with Akshita Realty and reach thousands of verified buyers. We handle marketing, site visits, negotiations, and paperwork.',
    features: [
      'Professional photography & listing',
      'Buyer screening & qualification',
      'Price negotiation on your behalf',
      'Documentation & registration support',
    ],
  },
  {
    title: 'Resale Assistance',
    icon: '🔄',
    description:
      'Buying or selling a resale property involves additional due diligence. Our team verifies titles, checks encumbrances, and ensures a clean handover.',
    features: [
      'Title chain verification (30 years)',
      'Encumbrance certificate check',
      'Bank NOC coordination',
      'Property tax mutation support',
    ],
  },
  {
    title: 'Property Management',
    icon: '🔑',
    description:
      'Let your investment work for you. We handle tenants, maintenance, rent collection, and legal compliance — so you don\'t have to.',
    features: [
      'Tenant sourcing & background checks',
      'Rent deed drafting & legal compliance',
      'Monthly rent collection & reporting',
      'Maintenance coordination & inspections',
    ],
  },
  {
    title: 'Legal & RERA Support',
    icon: '⚖️',
    description:
      'All our listings come with RERA verification. Our legal desk reviews sale agreements, builder-buyer agreements, and registers your property safely.',
    features: [
      'UP RERA project & agent verification',
      'Sale deed & ATS review',
      'Stamp duty & registration support',
      'Builder-buyer agreement guidance',
    ],
  },
  {
    title: 'NRI Services',
    icon: '✈️',
    description:
      'Based abroad but investing in Lucknow? We manage every step — property shortlisting, virtual tours, legal verification, and power of attorney guidance.',
    features: [
      'Virtual property tours & video walkthroughs',
      'Power of attorney facilitation',
      'NRO/NRE compliance guidance',
      'Post-possession management',
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink text-white py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80"
            alt="Our services"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink to-ink/70" />
        <Container className="relative z-10">
          <p className="text-xs uppercase tracking-[0.2em] text-sky mb-4">What we do</p>
          <h1 className="font-display text-5xl font-semibold leading-tight md:text-7xl max-w-3xl">
            Services built for <em className="italic font-normal">every journey</em>
          </h1>
          <p className="mt-6 max-w-xl text-white/70 leading-relaxed">
            Whether you&apos;re buying your first home, selling an investment, or managing a portfolio — Akshita Realty has a dedicated service for every stage of your property journey.
          </p>
        </Container>
      </section>

      {/* Services grid */}
      <section className="py-24 bg-cream">
        <Container>
          <SectionHeading
            overline="Our services"
            title="Everything you need"
            italicWord="need"
            className="mb-16 max-w-lg"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-black/5 hover:border-gold/20"
              >
                <span className="text-3xl">{service.icon}</span>
                <h2 className="font-display text-xl font-semibold text-ink mt-4 mb-3">
                  {service.title}
                </h2>
                <p className="text-sm text-ink/60 leading-relaxed mb-5">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink/70">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Property management highlight */}
      <section className="bg-ink text-white py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky mb-4">Deep dive</p>
              <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
                Property <em className="italic font-normal">management</em> — end to end
              </h2>
              <p className="mt-6 text-white/70 leading-relaxed">
                Owning a rental property in Lucknow should be passive income, not a second job. Our property management service handles every responsibility — legal, operational, and financial — so your investment delivers returns without the stress.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  ['Tenant Screening', 'Full background & reference checks'],
                  ['Rent Collection', 'On-time collection with monthly statements'],
                  ['Maintenance', 'Vetted vendors, fast turnaround'],
                  ['Legal', 'RERA compliant agreements & renewals'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-xl border border-white/10 p-4">
                    <p className="text-gold text-sm font-semibold mb-1">{title}</p>
                    <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 text-gold text-sm font-medium hover:gap-4 transition-all"
              >
                Enquire about management <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
                alt="Property management"
                fill
                className="object-cover opacity-75"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white border-t border-black/5 text-center">
        <Container>
          <SectionHeading
            title="Ready to get started?"
            className="mx-auto max-w-xl [&_h2]:text-center"
          />
          <p className="mt-5 text-ink/60 max-w-md mx-auto">
            Speak with one of our specialists today. No obligation, just expert guidance.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-8 py-3 text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 text-ink px-8 py-3 text-sm font-medium hover:border-ink/50 transition-colors"
            >
              Browse properties
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
