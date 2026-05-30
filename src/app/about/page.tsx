import Image from 'next/image';
import Link from 'next/link';
import { listLocalities } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Akshita Realty',
  description: 'Premium real estate expertise in Lucknow since 2012. Learn our story, values, and the team behind Akshita Realty.',
};

const VALUES = [
  {
    title: 'Transparency',
    body: 'Every listing on Akshita Realty is verified for accuracy. No hidden charges, no inflated prices — just honest, factual information.',
  },
  {
    title: 'Personalisation',
    body: 'We believe the right home is deeply personal. Our specialists take time to understand your life before recommending a property.',
  },
  {
    title: 'Expertise',
    body: 'With over a decade in the Lucknow market, our team has deep knowledge of every micro-market, price trend, and legal nuance.',
  },
  {
    title: 'Trust',
    body: '2,600+ satisfied clients across Lucknow and counting. We build long-term relationships, not one-time transactions.',
  },
];

const TEAM = [
  { name: 'Akshita Singh', role: 'Founder & Managing Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { name: 'Rajeev Sharma', role: 'Head of Commercial', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
  { name: 'Priya Verma', role: 'Senior Residential Advisor', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80' },
  { name: 'Amit Gupta', role: 'Legal & RERA Compliance', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
];

export default function AboutPage() {
  const localities = listLocalities();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink text-white py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80"
            alt="Akshita Realty"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-ink/60" />
        <Container className="relative z-10">
          <p className="text-xs uppercase tracking-[0.2em] text-sky mb-4">Our story</p>
          <h1 className="font-display text-5xl font-semibold leading-tight md:text-7xl max-w-3xl">
            Built on <em className="italic font-normal">trust,</em><br />
            grown on <em className="italic font-normal">results</em>
          </h1>
          <p className="mt-6 max-w-xl text-white/70 leading-relaxed">
            Since 2012, Akshita Realty has helped families, professionals, and investors navigate Lucknow&apos;s property market with confidence and clarity.
          </p>
        </Container>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-cream">
        <Container>
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <SectionHeading
                overline="Who we are"
                title="Our story"
                italicWord="story"
                className="mb-6"
              />
              <div className="space-y-4 text-ink/70 leading-relaxed">
                <p>
                  Akshita Realty was founded in 2012 with a single conviction: buying or selling property in Lucknow should be a joy, not a struggle. We started as a boutique consultancy in Gomti Nagar, helping a handful of families find homes that matched their aspirations.
                </p>
                <p>
                  Over the years, we expanded across all of Lucknow&apos;s major localities — from heritage Hazratganj to the planned elegance of Sushant Golf City. Today, with 40+ specialists and a portfolio spanning commercial, resale, and premium projects, we remain guided by the same principle our founder built us on: each client deserves personalised, expert attention.
                </p>
                <p>
                  We are proud to have partnered with 2,600+ happy buyers and served some of Lucknow&apos;s most discerning investors, NRI clients, and first-time home buyers — all with the same respect and dedication.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80"
                alt="Akshita Realty office"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="bg-ink text-white py-16">
        <Container>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {[
              { value: '2012', label: 'Year founded' },
              { value: String(localities.length), label: 'Localities covered' },
              { value: '40+', label: 'Specialists' },
              { value: '2,600+', label: 'Happy buyers' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-5xl font-semibold text-gold">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <Container>
          <SectionHeading
            overline="What drives us"
            title="Our values"
            italicWord="values"
            className="mb-16 max-w-lg"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-black/5 p-7 hover:border-gold/30 transition-colors">
                <div className="h-1 w-8 bg-gold rounded mb-5" />
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{v.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-24 bg-cream">
        <Container>
          <SectionHeading
            overline="The people behind it"
            title="Meet the team"
            italicWord="team"
            className="mb-16"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden mb-5">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <p className="font-display text-lg font-semibold text-ink">{member.name}</p>
                <p className="text-sm text-ink/50 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-ink/60 mb-4">Want to join our team of specialists?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-7 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
