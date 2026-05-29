'use client';

import { useActionState } from 'react';
import { formatINR } from '@/lib/format';
import type { EstimateState, ValuationLeadState } from '@/app/valuation/actions';

// AI-UPGRADE: generate a natural-language rationale for the valuation range using
// the Vercel AI SDK (generateText) routed through Vercel AI Gateway.
// Pass: locality name, area, bhk, type, low, high, basis as prompt context.
// See: https://sdk.vercel.ai/docs and https://vercel.com/docs/ai-gateway

interface Locality {
  name: string;
  slug: string;
}

interface ValuationToolProps {
  localities: Locality[];
  estimateAction: (prevState: EstimateState, formData: FormData) => Promise<EstimateState>;
  leadAction: (prevState: ValuationLeadState, formData: FormData) => Promise<ValuationLeadState>;
}

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Commercial'];
const BHK_OPTIONS = ['1', '2', '3', '4', '5'];

const IDLE_ESTIMATE: EstimateState = { status: 'idle' };
const IDLE_LEAD: ValuationLeadState = { status: 'idle' };

/** Build a templated rationale string from estimate results. */
function buildRationale(state: EstimateState): string {
  if (state.status !== 'success') return '';
  const type = state.propertyType ?? 'Property';
  const area = state.areaSqft ? `${state.areaSqft.toLocaleString('en-IN')} sq ft` : '';
  const bhkStr = state.bhk ? `${state.bhk} BHK ` : '';
  const low = state.low ? formatINR(state.low) : '';
  const high = state.high ? formatINR(state.high) : '';

  return (
    `This estimate for a ${bhkStr}${type}${area ? ` of ${area}` : ''} is based on ` +
    `${state.basis}. The indicative range of ${low}–${high} accounts for ±8% market variance. ` +
    `Final value depends on floor, furnishing, age of construction, and current demand. ` +
    `Speak with our experts for a precise assessment.`
  );
}

export function ValuationTool({ localities, estimateAction, leadAction }: ValuationToolProps) {
  const [estimateState, estimateFormAction, estimatePending] = useActionState(
    estimateAction,
    IDLE_ESTIMATE,
  );
  const [leadState, leadFormAction, leadPending] = useActionState(
    leadAction,
    IDLE_LEAD,
  );

  const showResult = estimateState.status === 'success';

  return (
    <div className="space-y-10">
      {/* ── Estimate form ─────────────────────────────────────────────── */}
      <form action={estimateFormAction} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Locality */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="localitySlug" className="text-sm font-medium text-ink">
              Locality
            </label>
            <select
              id="localitySlug"
              name="localitySlug"
              required
              className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40 transition-colors"
            >
              <option value="">Select locality…</option>
              {localities.map((loc) => (
                <option key={loc.slug} value={loc.slug}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="areaSqft" className="text-sm font-medium text-ink">
              Area (sq ft)
            </label>
            <input
              id="areaSqft"
              name="areaSqft"
              type="number"
              min={1}
              max={100000}
              step={1}
              required
              placeholder="e.g. 1200"
              className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40 transition-colors"
            />
          </div>

          {/* BHK */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bhk" className="text-sm font-medium text-ink">
              BHK <span className="text-ink/40 font-normal">(optional)</span>
            </label>
            <select
              id="bhk"
              name="bhk"
              className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40 transition-colors"
            >
              <option value="">Any</option>
              {BHK_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} BHK
                </option>
              ))}
            </select>
          </div>

          {/* Property type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="propertyType" className="text-sm font-medium text-ink">
              Property type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              required
              className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40 transition-colors"
            >
              <option value="">Select type…</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {estimateState.status === 'error' && (
          <p role="alert" className="text-sm text-red-600">
            {estimateState.error}
          </p>
        )}

        <button
          type="submit"
          disabled={estimatePending}
          className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-8 py-3 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {estimatePending ? 'Estimating…' : 'Estimate value'}
        </button>
      </form>

      {/* ── Result card ───────────────────────────────────────────────── */}
      {showResult && estimateState.low !== undefined && estimateState.high !== undefined && (
        <div className="rounded-3xl bg-ink text-white p-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Estimated value</p>
          <p className="font-display text-4xl font-semibold leading-tight">
            {formatINR(estimateState.low)}&nbsp;–&nbsp;{formatINR(estimateState.high)}
          </p>
          {estimateState.basis && (
            <p className="text-sm text-white/60">{estimateState.basis}</p>
          )}
          <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
            {buildRationale(estimateState)}
          </p>
        </div>
      )}

      {/* ── Expert lead form ──────────────────────────────────────────── */}
      {showResult && leadState.status !== 'success' && (
        <div className="rounded-3xl border border-black/8 bg-cream p-8 space-y-5">
          <div>
            <p className="font-display text-xl font-semibold text-ink">
              Get a precise valuation from our <em className="italic font-normal">experts</em>
            </p>
            <p className="mt-1 text-sm text-ink/60">
              Our specialists will conduct a detailed market analysis for your property.
            </p>
          </div>

          {/* Hidden context for the lead message */}
          <input
            type="hidden"
            name="leadMessage"
            form="lead-form"
            value={
              estimateState.propertyType && estimateState.areaSqft && estimateState.localitySlug
                ? `Valuation request: ${estimateState.propertyType} ${estimateState.areaSqft} sqft in ${estimateState.localitySlug}, est ${estimateState.low ? formatINR(estimateState.low) : ''}–${estimateState.high ? formatINR(estimateState.high) : ''}`
                : 'Valuation request'
            }
          />

          <form id="lead-form" action={leadFormAction} className="space-y-4">
            <input type="hidden" name="leadMessage" value={
              estimateState.propertyType && estimateState.areaSqft && estimateState.localitySlug
                ? `Valuation request: ${estimateState.propertyType} ${estimateState.areaSqft} sqft in ${estimateState.localitySlug}, est ${estimateState.low ? formatINR(estimateState.low) : ''}–${estimateState.high ? formatINR(estimateState.high) : ''}`
                : 'Valuation request'
            } />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lead-name" className="text-sm font-medium text-ink">
                  Your name
                </label>
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Ravi Kumar"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lead-phone" className="text-sm font-medium text-ink">
                  Mobile number
                </label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="9876543210"
                  pattern="[6-9][0-9]{9}"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40 transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lead-email" className="text-sm font-medium text-ink">
                Email <span className="text-ink/40 font-normal">(optional)</span>
              </label>
              <input
                id="lead-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40 transition-colors"
              />
            </div>

            {leadState.status === 'error' && (
              <p role="alert" className="text-sm text-red-600">
                {leadState.error}
              </p>
            )}

            <button
              type="submit"
              disabled={leadPending}
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-8 py-3 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
            >
              {leadPending ? 'Sending…' : 'Request expert valuation'}
            </button>
          </form>
        </div>
      )}

      {/* ── Success state ─────────────────────────────────────────────── */}
      {leadState.status === 'success' && (
        <div
          role="status"
          className="rounded-3xl border border-black/8 bg-cream p-8 text-center space-y-2"
        >
          <p className="font-display text-xl font-semibold text-ink">
            Thank you — we&apos;ll be in touch shortly.
          </p>
          <p className="text-sm text-ink/60">
            Our specialist will reach out within 24 hours with a detailed property valuation.
          </p>
        </div>
      )}
    </div>
  );
}
