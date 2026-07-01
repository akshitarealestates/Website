import { listLocalities } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { InvestmentPlanner } from '@/components/ai/investment-planner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Property Investment & ROI Planner | Akshita Real Estate',
  description:
    'Leverage premium data projections and our advanced AI engine to calculate future valuations, rental yields, and custom real estate investment theses in Lucknow.',
};

export default function InvestmentPlannerPage() {
  const localities = listLocalities().map((l) => ({
    name: l.name,
    slug: l.slug,
    avgPricePerSqft: l.avgPricePerSqft,
  }));

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Hero header section ────────────────────────────────────────── */}
      <section className="bg-ink text-white pt-28 pb-20 relative overflow-hidden">
        {/* Subtle decorative vector element for technology feel */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-gold/10 to-transparent opacity-40 pointer-events-none" />
        <Container className="relative z-10">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-gold uppercase tracking-[0.2em] mb-4 w-fit">
            <span className="flex h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            AI-Driven Real Estate Advisory
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] md:text-7xl max-w-4xl">
            AI Property Investment & <em className="italic font-light text-gold">ROI Planner</em>
          </h1>
          <p className="mt-6 max-w-2xl text-white/70 text-base md:text-lg leading-relaxed">
            Formulate high-yield capital strategies based on live Lucknow market indices. Project compounding asset appreciation, model regional rental returns, and generate custom executive investment theses in seconds.
          </p>
        </Container>
      </section>

      {/* ── Main Planner Component Section ──────────────────────────────── */}
      <section className="py-16">
        <Container>
          <InvestmentPlanner localities={localities} />
        </Container>
      </section>
    </div>
  );
}
