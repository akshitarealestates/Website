import { listLocalities } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { ValuationTool } from '@/components/ai/valuation-tool';
import { estimateAction, valuationLeadAction } from './actions';

export const metadata = {
  title: "What's My Property Worth? | Akshita Realty",
  description:
    'Get an instant AI-powered valuation estimate for your property in Lucknow based on live market rates.',
};

export default function ValuationPage() {
  const localities = listLocalities().map((l) => ({ name: l.name, slug: l.slug }));

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="bg-ink text-white pt-24 pb-20">
        <Container>
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">
            Property Valuation
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] md:text-6xl max-w-2xl">
            What&apos;s your property{' '}
            <em className="italic font-normal">worth?</em>
          </h1>
          <p className="mt-6 max-w-xl text-white/70 text-base md:text-lg leading-relaxed">
            Get an instant data-driven estimate based on real market rates across Lucknow&apos;s
            key localities — then connect with our experts for a precise assessment.
          </p>
        </Container>
      </div>

      {/* ── Tool ─────────────────────────────────────────────────────────── */}
      <Container className="py-16">
        <ValuationTool
          localities={localities}
          estimateAction={estimateAction}
          leadAction={valuationLeadAction}
        />
      </Container>
    </div>
  );
}
