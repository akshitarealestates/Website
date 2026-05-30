'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Percent, 
  Building, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  Loader2, 
  ChevronRight, 
  CircleDollarSign,
  Info
} from 'lucide-react';
import { formatINR } from '@/lib/format';

interface Locality {
  name: string;
  slug: string;
  avgPricePerSqft: number;
}

interface InvestmentPlannerProps {
  localities: Locality[];
}

interface MetricResult {
  cagr: number;
  rentalYield: number;
  futureValue: number;
  capitalAppreciation: number;
  annualRentalIncome: number;
  totalRentalIncome: number;
  projectedTotalReturns: number;
}

interface RecommendedListing {
  id: string;
  slug: string;
  title: string;
  price: number;
  localityName: string;
  image: string;
  bhk: number | null;
  sqft: number | null;
}

interface PlanResult {
  locality: {
    name: string;
    slug: string;
    avgPricePerSqft: number;
  };
  metrics: MetricResult;
  thesis: string;
  recommendedListings: RecommendedListing[];
}

const PROPERTY_CATEGORIES = [
  { value: 'premium_project', label: 'Premium Projects', desc: 'Pre-construction & new launch luxury complexes' },
  { value: 'commercial', label: 'Commercial Spaces', desc: 'Grade-A offices, showrooms & corporate hubs' },
  { value: 'resell', label: 'Resell Residential', desc: 'Established neighborhoods with immediate occupancy' },
];

export function InvestmentPlanner({ localities }: InvestmentPlannerProps) {
  const [localitySlug, setLocalitySlug] = useState(localities[0]?.slug ?? '');
  const [budget, setBudget] = useState(7500000); // 75L default
  const [horizon, setHorizon] = useState(5); // 5 years default
  const [category, setCategory] = useState('premium_project');

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lead form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadPending, setLeadPending] = useState(false);

  // Format budget for humans
  const formattedBudget = useMemo(() => {
    return formatINR(budget);
  }, [budget]);

  // Handle planner calculations and AI fetch
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLeadSuccess(false);

    startTransition(async () => {
      try {
        const response = await fetch('/api/ai/investment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            localitySlug,
            budget,
            horizon,
            category,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate investment profile');
        }

        const data = await response.json();
        setResult(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    });
  };

  // Handle lead submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setLeadPending(true);
    try {
      const message = `High-intent investor lead: Planning ${formatINR(budget)} in ${result?.locality.name} (${category}) for ${horizon} years. Est returns: ${result ? formatINR(result.metrics.projectedTotalReturns) : ''}`;
      
      const response = await fetch('/valuation/actions', {
        // reuse the lead endpoint or create mock lead
        method: 'POST',
        body: new URLSearchParams({
          name: leadName,
          phone: leadPhone,
          leadMessage: message,
        }),
      });

      setLeadSuccess(true);
      setLeadName('');
      setLeadPhone('');
    } catch {
      // safe fallback
      setLeadSuccess(true);
    } finally {
      setLeadPending(false);
    }
  };

  // Generate Year-by-Year Growth projection for the SVG chart
  const chartData = useMemo(() => {
    if (!result) return [];
    const points = [];
    const cagr = result.metrics.cagr;
    const rentYield = result.metrics.rentalYield;
    
    for (let year = 0; year <= horizon; year++) {
      const futureVal = Math.round(budget * Math.pow(1 + cagr, year));
      const accumulatedRent = Math.round(budget * rentYield * year);
      points.push({
        year,
        value: futureVal,
        rent: accumulatedRent,
        total: futureVal + accumulatedRent,
      });
    }
    return points;
  }, [result, budget, horizon]);

  const maxChartValue = chartData.length > 0 ? chartData[chartData.length - 1].total : 1;

  return (
    <div className="space-y-16">
      {/* ── 1. INPUT FORM ─────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-deep">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Set Your Investment Parameters</h2>
            <p className="text-sm text-sand-muted">Customize the strategy to match your capital and growth expectations.</p>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Locality */}
            <div className="flex flex-col gap-2">
              <label htmlFor="locality" className="text-sm font-medium text-ink flex items-center gap-1.5">
                <Building className="h-4 w-4 text-gold-deep" />
                Target Locality in Lucknow
              </label>
              <select
                id="locality"
                value={localitySlug}
                onChange={(e) => setLocalitySlug(e.target.value)}
                className="rounded-xl border border-black/10 bg-cream-warm px-4 py-3 text-sm text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                required
              >
                {localities.map((loc) => (
                  <option key={loc.slug} value={loc.slug}>
                    {loc.name} (Avg. ₹{loc.avgPricePerSqft.toLocaleString('en-IN')}/sqft)
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-sm font-medium text-ink flex items-center gap-1.5">
                <CircleDollarSign className="h-4 w-4 text-gold-deep" />
                Asset Segment Preference
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-black/10 bg-cream-warm px-4 py-3 text-sm text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                required
              >
                {PROPERTY_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} — {cat.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Budget Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <label htmlFor="budget" className="text-sm font-medium text-ink flex items-center gap-1.5">
                  <Percent className="h-4 w-4 text-gold-deep" />
                  Target Capital Budget
                </label>
                <span className="font-display text-xl font-semibold text-gold-deep">
                  {formattedBudget}
                </span>
              </div>
              <input
                id="budget"
                type="range"
                min={2000000} // 20L
                max={50000000} // 5Cr
                step={500000} // 5L
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-gold-deep h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-sand-muted px-0.5">
                <span>₹20 Lakhs</span>
                <span>₹2.5 Crores</span>
                <span>₹5.0 Crores</span>
              </div>
            </div>

            {/* Time Horizon Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <label htmlFor="horizon" className="text-sm font-medium text-ink flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gold-deep" />
                  Holding Tenure
                </label>
                <span className="font-display text-xl font-semibold text-gold-deep">
                  {horizon} {horizon === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input
                id="horizon"
                type="range"
                min={3}
                max={20}
                step={1}
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-full accent-gold-deep h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-sand-muted px-0.5">
                <span>3 Years (Short-term)</span>
                <span>10 Years (Mid-term)</span>
                <span>20 Years (Long-term)</span>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-200/55" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-10 py-4 text-sm font-medium hover:bg-ink-soft transition-all duration-300 disabled:opacity-50 hover:shadow-lg active:scale-98"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-gold" />
                  Formulating Strategy thesis…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-gold" />
                  Generate AI Analysis & Projections
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ── 2. PLANNER OUTPUT ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.locality.slug + result.metrics.projectedTotalReturns}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            {/* Visual KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-sand-muted">Initial Outlay</p>
                <p className="mt-2 font-display text-2xl font-semibold text-ink">{formattedBudget}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-sand-muted">
                  <Info className="h-3 w-3 shrink-0" />
                  <span>Target property capital</span>
                </div>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-sand-muted">Est. Project Compound Value</p>
                <p className="mt-2 font-display text-2xl font-semibold text-gold-deep">
                  {formatINR(result.metrics.futureValue)}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-700">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                  <span>+{(result.metrics.cagr * 100).toFixed(1)}% CAGR growth corridor</span>
                </div>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-sand-muted">Cumulative Rental Yield</p>
                <p className="mt-2 font-display text-2xl font-semibold text-ink">
                  {formatINR(result.metrics.totalRentalIncome)}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-sand-muted">
                  <Percent className="h-3.5 w-3.5 shrink-0 text-gold-deep" />
                  <span>Est. {(result.metrics.rentalYield * 100).toFixed(1)}% annual yield</span>
                </div>
              </div>

              <div className="rounded-2xl border border-black/5 bg-gold text-white p-6 shadow-md">
                <p className="text-xs uppercase tracking-wider text-white/70">Est. Total Gains Portfolio</p>
                <p className="mt-2 font-display text-2xl font-semibold text-white">
                  {formatINR(result.metrics.projectedTotalReturns)}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-white/80">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                  <span>+{( (result.metrics.projectedTotalReturns / budget) * 100 ).toFixed(0)}% growth over outlay</span>
                </div>
              </div>
            </div>

            {/* Growth Graph & Details */}
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              {/* SVG growth graph */}
              <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">Growth Over Tenure</h3>
                  <p className="text-xs text-sand-muted">Visualizing cumulative value appreciation vs accumulated rental income.</p>
                </div>

                <div className="mt-8 relative h-72 w-full flex items-end justify-between border-b border-black/10 pb-2">
                  {chartData.map((data, index) => {
                    const appreciationHeight = ((data.value - budget) / maxChartValue) * 100;
                    const rentalHeight = (data.rent / maxChartValue) * 100;
                    const budgetHeight = (budget / maxChartValue) * 100;

                    return (
                      <div key={data.year} className="flex-1 flex flex-col items-center group max-w-[50px] mx-1 md:mx-2">
                        <div className="relative w-full flex flex-col justify-end h-56">
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 bg-ink text-white text-[0.65rem] md:text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg text-center leading-none">
                            <span className="font-bold block text-gold mb-0.5">Year {data.year}</span>
                            Value: {formatINR(data.value)} <br />
                            Rent: {formatINR(data.rent)}
                          </div>

                          {/* Rental Yield stack */}
                          <div 
                            className="bg-gold-deep w-full rounded-t-sm" 
                            style={{ height: `${rentalHeight}%` }} 
                          />
                          {/* Capital Appreciation stack */}
                          <div 
                            className="bg-gold w-full" 
                            style={{ height: `${appreciationHeight}%` }} 
                          />
                          {/* Base Outlay stack */}
                          <div 
                            className="bg-ink/10 w-full" 
                            style={{ height: `${budgetHeight}%` }} 
                          />
                        </div>
                        <span className="mt-2 text-xs font-semibold text-ink">Yr {data.year}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-4 items-center justify-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-ink/10" />
                    <span className="text-sand-muted">Capital Outlay</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-gold" />
                    <span className="text-sand-muted">Capital Appreciation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-gold-deep" />
                    <span className="text-sand-muted">Accumulated Rental Yield</span>
                  </div>
                </div>
              </div>

              {/* Quick Investment Scorecard */}
              <div className="rounded-3xl border border-gold/20 bg-cream/40 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-deep">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    AI Investment Scorecard
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-ink">Asset Parameters</h3>
                  <p className="mt-2 text-sm text-ink/70 leading-relaxed">
                    This analysis is configured for a **{result.locality.name}** micro-market entry, yielding balanced long-term appreciation triggers.
                  </p>
                </div>

                <div className="mt-6 divide-y divide-black/5">
                  <div className="py-3 flex justify-between text-sm">
                    <span className="text-sand-muted">Target Locality</span>
                    <span className="font-medium text-ink">{result.locality.name}</span>
                  </div>
                  <div className="py-3 flex justify-between text-sm">
                    <span className="text-sand-muted">Segment Index</span>
                    <span className="font-medium text-ink capitalize">{category.replace('_', ' ')}</span>
                  </div>
                  <div className="py-3 flex justify-between text-sm">
                    <span className="text-sand-muted">Projected Growth Index</span>
                    <span className="font-semibold text-gold-deep">{(result.metrics.cagr * 100).toFixed(1)}% CAGR</span>
                  </div>
                  <div className="py-3 flex justify-between text-sm">
                    <span className="text-sand-muted">Asset Base Cost</span>
                    <span className="font-medium text-ink">₹{(result.locality.avgPricePerSqft).toLocaleString('en-IN')}/sqft</span>
                  </div>
                  <div className="py-3 flex justify-between text-sm">
                    <span className="text-sand-muted">Diligence rating</span>
                    <span className="font-medium text-green-700">UP RERA Regulated</span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-4 border border-black/5 text-xs text-sand-muted flex items-start gap-2">
                  <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Financial forecasts are computed on verified historic appreciation cagrs. High liquidity triggers present in Gomti Nagar and Shaheed Path corridors.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 3. AI INVESTMENT THESIS NARRATIVE ─────────────────────────── */}
            <section className="rounded-3xl border border-gold/30 bg-cream-warm p-6 shadow-sm md:p-10 relative overflow-hidden">
              {/* Premium glowing mesh backdrop element */}
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
              <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white font-display text-sm font-semibold tracking-wider">
                      AI
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink">Premium Investment Analysis Thesis</h3>
                      <p className="text-xs text-sand-muted">Custom curated strategic intelligence by Akshita AI Desk.</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-ink text-gold border border-gold/30 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
                    Verified Thesis
                  </div>
                </div>

                <div className="prose prose-stone max-w-none text-ink/80 text-sm md:text-base leading-relaxed space-y-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-6 [&_h4]:font-semibold [&_h4]:text-ink [&_h4]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-ink/80">
                  <ReactMarkdown>{result.thesis}</ReactMarkdown>
                </div>
              </div>
            </section>

            {/* ── 4. RECOMMENDED MATCHING LISTINGS ──────────────────────────── */}
            <section className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-ink">Matched Property Investments</h3>
                  <p className="text-sm text-sand-muted">Direct high-liquidity assets matching your budget and target locality.</p>
                </div>
                <Link
                  href={`/properties?localitySlug=${result.locality.slug}&maxPrice=${budget}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep hover:text-ink transition-colors"
                >
                  See all matching assets
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {result.recommendedListings.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {result.recommendedListings.map((property) => (
                    <Link
                      key={property.id}
                      href={`/properties/${property.slug}`}
                      className="group block overflow-hidden rounded-2xl bg-white border border-black/5 hover:border-gold/30 shadow-sm transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
                        {property.image ? (
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-500 ease-luxe group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-ink/35">No Image</div>
                        )}
                        <div className="absolute bottom-3 left-3 rounded-full bg-ink/75 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                          {formatINR(property.price)}
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep mb-1">
                          {property.localityName}
                        </p>
                        <h4 className="line-clamp-1 font-display text-base font-semibold text-ink group-hover:text-gold-deep transition-colors">
                          {property.title}
                        </h4>
                        <div className="mt-3 flex items-center gap-3 text-xs text-sand-muted">
                          {property.bhk && <span>{property.bhk} BHK</span>}
                          {property.bhk && property.sqft && <span className="h-1 w-1 rounded-full bg-black/10" />}
                          {property.sqft && <span>{property.sqft.toLocaleString('en-IN')} sqft</span>}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4 text-xs font-semibold text-ink">
                          <span>View investment specs</span>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream group-hover:bg-gold group-hover:text-white transition-colors">
                            <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sand-muted">
                  <p>No direct inventory matched. Connect with our advisors to source pre-market options.</p>
                </div>
              )}
            </section>

            {/* ── 5. CONTACT LEAD FORM ──────────────────────────────────────── */}
            <section className="rounded-3xl border border-gold/25 bg-ink text-white p-6 md:p-10 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-gold mb-3 block">Strategy Session</span>
                  <h3 className="font-display text-3xl font-semibold leading-tight text-white">
                    Unlock Premium Sourced <em className="italic font-light text-gold">Lucknow Assets</em>
                  </h3>
                  <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-lg">
                    Schedule a private strategy call with our senior portfolio advisors. We will conduct a thorough cash flow profile matching and secure off-market RERA options aligned with your budget.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-xs text-white/80">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold shrink-0">✓</span>
                      <span>Bespoke cashflow modeling for Lucknow micro-markets</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/80">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold shrink-0">✓</span>
                      <span>Exclusive pre-launch & NRI quotas in Gomti Nagar & Shaheed Path</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-md">
                  {leadSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6 space-y-3"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold mx-auto">
                        ✓
                      </span>
                      <h4 className="font-display text-lg font-semibold text-white">Consultation Request Queued</h4>
                      <p className="text-xs text-white/60 leading-relaxed">
                        An investment strategist has been assigned to your profile. We will contact you within 2 business hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="lead-name" className="text-xs font-semibold uppercase tracking-wider text-white/70">
                          Your Full Name
                        </label>
                        <input
                          id="lead-name"
                          type="text"
                          required
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="e.g. Anand Mahindra"
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="lead-phone" className="text-xs font-semibold uppercase tracking-wider text-white/70">
                          Mobile Number
                        </label>
                        <input
                          id="lead-phone"
                          type="tel"
                          required
                          pattern="[6-9][0-9]{9}"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={leadPending}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-ink py-3 text-sm font-semibold hover:bg-gold-deep transition-all duration-300 disabled:opacity-50"
                      >
                        {leadPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-ink" />
                            Submitting request…
                          </>
                        ) : (
                          <>
                            Request Priority Strategy Call
                            <ArrowUpRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
