import Image from 'next/image';
import Link from 'next/link';
import { listLocalities } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Akshita Real Estate',
  description: 'Premium real estate expertise in Lucknow since 2012. Learn our story, values, and the team behind Akshita Real Estate.',
};

const VALUES = [
  {
    title: 'Transparency',
    body: 'Every listing on Akshita Real Estate is verified for accuracy. No hidden charges, no inflated prices — just honest, factual information.',
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

const TEAM: { name: string; role: string; image?: string }[] = [
  { name: 'Harshit Singh', role: 'Chief Business Officer' },
  { name: 'Vijendra Pratap Singh', role: 'Chief Technology Officer' },
];

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function AboutPage() {
  const localities = listLocalities();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink text-white py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80"
            alt="Akshita Real Estate"
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
            Lucknow&apos;s advanced, AI-driven real estate firm — combining local expertise with intelligent technology to deliver the best value to every customer.
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
                  Akshita Real Estate is Lucknow&apos;s most advanced, AI-driven real estate firm. We pair deep, on-the-ground knowledge of the city&apos;s micro-markets with intelligent technology — so buying, selling, or investing in property becomes effortless, transparent, and genuinely rewarding.
                </p>
                <p>
                  Our AI works for you at every step: conversational search that understands exactly what you want, instant data-backed valuations, an investment &amp; ROI planner, and locality insights drawn from real market signals. The result is clarity and confidence — you always know you&apos;re getting the best value, not just a listing.
                </p>
                <p>
                  Above all, we are relentlessly focused on delivering the best value to our customers. From first-time home buyers to seasoned investors and NRI clients across Lucknow — from heritage Hazratganj to the planned elegance of Sushant Golf City — every recommendation we make is optimised around one goal: the smartest outcome for you.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80"
                alt="Akshita Real Estate office"
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
          <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-12 sm:gap-16">
            {TEAM.map((member) => (
              <div key={member.name} className="w-52 text-center">
                <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden mb-5">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-gold-deep font-display text-4xl font-semibold text-cream">
                      {initials(member.name)}
                    </div>
                  )}
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
