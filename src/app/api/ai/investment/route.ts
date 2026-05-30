import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { aiEnabled, aiModel } from '@/lib/ai/provider';
import { listLocalities, listProperties } from '@/lib/data/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface InvestmentRequest {
  localitySlug?: string;
  budget?: number;
  horizon?: number;
  category?: string;
}

// Local CAGR rates based on historical data & infrastructure projections in Lucknow
const LOCALITY_CAGRS: Record<string, number> = {
  'gomti-nagar': 0.085, // 8.5%
  'hazratganj': 0.065,  // 6.5%
  'sushant-golf-city': 0.110, // 11.0% (high growth corridor)
  'indira-nagar': 0.075, // 7.5%
  'aliganj': 0.068, // 6.8%
  'mahanagar': 0.070, // 7.0%
  'vibhuti-khand': 0.098, // 9.8% (IT/Commercial hub)
  'jankipuram': 0.082, // 8.2%
};

// Typical annual rental yield for property categories in Lucknow
const CATEGORY_YIELDS: Record<string, number> = {
  'commercial': 0.075, // 7.5% commercial yield
  'resell': 0.030, // 3.0% residential resale yield
  'premium_project': 0.035, // 3.5% premium residential yield
};

export async function POST(req: Request) {
  let body: InvestmentRequest;
  try {
    body = (await req.json()) as InvestmentRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const localitySlug = body.localitySlug ?? '';
  const budget = Number(body.budget) || 5000000; // default 50L
  const horizon = Number(body.horizon) || 5; // default 5 years
  const category = body.category ?? 'premium_project';

  if (!localitySlug) {
    return NextResponse.json({ error: 'Locality is required' }, { status: 400 });
  }

  const localities = listLocalities();
  const locality = localities.find((l) => l.slug === localitySlug);
  if (!locality) {
    return NextResponse.json({ error: 'Locality not found' }, { status: 404 });
  }

  // ─── Financial calculations ───────────────────────────────────────────────
  const cagr = LOCALITY_CAGRS[localitySlug] ?? 0.080; // default 8% growth
  const rentalYield = CATEGORY_YIELDS[category] ?? 0.035; // default 3.5%

  const futureValue = Math.round(budget * Math.pow(1 + cagr, horizon));
  const capitalAppreciation = futureValue - budget;
  const annualRentalIncome = Math.round(budget * rentalYield);
  const totalRentalIncome = annualRentalIncome * horizon;
  const projectedTotalReturns = capitalAppreciation + totalRentalIncome;

  // ─── Query matching properties in our database ─────────────────────────────
  // Fetch up to 3 published properties in this locality, ideally under or near budget
  const matchedListings = listProperties({
    localitySlug,
    category: category as any,
  })
    .filter((p) => p.price <= budget * 1.2) // allow up to 20% over budget
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      localityName: locality.name,
      image: p.images[0]?.url ?? '',
      bhk: p.bhk ?? null,
      sqft: p.carpetAreaSqft ?? p.builtupAreaSqft ?? null,
    }));

  // ─── Generate AI Thesis narrative ──────────────────────────────────────────
  let aiThesis = '';
  const formattedBudget = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(budget);
  const formattedFutureValue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(futureValue);

  if (aiEnabled) {
    try {
      const prompt = `You are a Senior Real Estate Investment Advisory bot at Akshita Realty, Lucknow.
Draft a highly professional, sophisticated, and data-backed Investment Thesis for an investor with the following profile:
- Locality: ${locality.name}
- Investment Budget: ${formattedBudget}
- Time Horizon: ${horizon} years
- Target Property Type: ${category.replace('_', ' ')}
- Projected CAGR: ${(cagr * 100).toFixed(1)}%
- Target Annual Rental Yield: ${(rentalYield * 100).toFixed(1)}%
- Projected Value in ${horizon} years: ${formattedFutureValue}

The thesis must be written in Markdown. Use elegant, clean structure (headings, bullet points, bold key insights). Make sure it includes:
1. **Macro Growth Corridors**: Detail Lucknow's expansion drivers relevant to ${locality.name} (e.g. Shaheed Path connectivity, Ring Road, upcoming infrastructure, metro, Lucknow-Kanpur industrial corridor, etc.).
2. **Micro-Market Outlook**: Specific review of ${locality.name}'s social ecosystem (hospitals like Medanta, colleges, CMS school, commercial office hubs, premium builders presence) and why it supports demand.
3. **Yield & Asset Performance**: Deep-dive into why ${category.replace('_', ' ')} properties perform well here. Highlight tenant profile (IT professionals, corporate executives, medical staff).
4. **Risk Diligence & RERA Compliance**: Practical checklist for investing in ${locality.name} (checking UP RERA registration, title chain verified for 30 years, municipal encumbrance check, possession delay mitigation).
5. **Executive Summary**: One concluding sentence with a definitive investment rating (Strong Buy / Accumulate / Hold) tailored to this ${horizon}-year horizon.

Keep the tone expert, polished, objective, and deeply encouraging. Avoid vague platitudes; write with specific authority on Lucknow's real estate dynamics.`;

      const { text } = await generateText({
        model: aiModel,
        system: "You are a senior real estate analyst providing elite investment advisory reports for premium Indian properties. Your writing is highly analytical, concise, structured, and free of generic filler text.",
        prompt,
      });

      aiThesis = text.trim();
    } catch (e) {
      console.error('LLM error', e);
      aiThesis = '';
    }
  }

  // Fallback narrative if AI key is missing or failed
  if (!aiThesis) {
    aiThesis = `### Executive Summary & Investment Thesis

An investment of **${formattedBudget}** in **${locality.name}** over a **${horizon}-year** horizon represents a highly strategic wealth-creation opportunity. Based on historical capital appreciation rates and infrastructure growth vectors in this corridor, we project the property value to grow to approximately **${formattedFutureValue}** at an estimated **${(cagr * 100).toFixed(1)}% CAGR**, supplemented by a target **${(rentalYield * 100).toFixed(1)}% annual rental yield**.

#### Key Growth Vectors
* **Infrastructure Triggers**: The locality enjoys strong connectivity via key arterial highways like Shaheed Path and the Lucknow Ring Road. Proximity to transit corridors, commercial centres, and major administrative offices ensures a steady influx of high-quality residents and corporate tenants.
* **Micro-Market Dynamics**: ${locality.name} hosts highly rated educational institutions (e.g., City Montessori School), premium medical hubs (e.g., Medanta Hospital), and vibrant retail belts. This mature social infrastructure forms a powerful defensive moat against market downturns.
* **Asset Allocation Advisory**: ${category.replace('_', ' ')} properties in this micro-market command premium pricing due to the rapid transition toward organized, high-quality developments. This structure delivers both superior capital gains and robust occupancy rates.

#### Strategic Risk Mitigation & Diligence
1. **UP RERA Verification**: Ensure that the target asset holds a valid UP RERA project registration with clear quarterly progress reports.
2. **Title Chain Security**: Conduct a rigorous 30-year title search and confirm municipal tax mutation clearance.
3. **Furnishing Leverage**: Furnished corporate leases in Lucknow's premium zones typically command a 20-30% premium, accelerating your net yield towards target projections.

**Investment Recommendation**: **ACCUMULATE** — Gomti Nagar and Amar Shaheed Path zones present elite risk-adjusted returns for mid-to-long term portfolios.`;
  }

  return NextResponse.json({
    locality: {
      name: locality.name,
      slug: locality.slug,
      avgPricePerSqft: locality.avgPricePerSqft,
    },
    metrics: {
      cagr,
      rentalYield,
      futureValue,
      capitalAppreciation,
      annualRentalIncome,
      totalRentalIncome,
      projectedTotalReturns,
    },
    thesis: aiThesis,
    recommendedListings: matchedListings,
  });
}
