'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Plus, X, Check, Sparkles, ArrowLeft, ArrowRight, PartyPopper } from 'lucide-react';
import type { SellState } from '@/app/sell/actions';

type Locality = { slug: string; name: string };

const labelCls = 'block text-xs font-medium uppercase tracking-wide text-ink/50';
const inputCls =
  'mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20';

const STEPS = ['Basics', 'Details', 'Photos', 'Review'] as const;

interface FormFields {
  title: string;
  listingType: 'sale' | 'rent';
  localitySlug: string;
  price: string;
  bhk: string;
  bedrooms: string;
  bathrooms: string;
  carpetAreaSqft: string;
  builtupAreaSqft: string;
  furnishing: string;
  description: string;
  amenities: string[];
  highlights: string;
  reraId: string;
}

const EMPTY: FormFields = {
  title: '',
  listingType: 'sale',
  localitySlug: '',
  price: '',
  bhk: '',
  bedrooms: '',
  bathrooms: '',
  carpetAreaSqft: '',
  builtupAreaSqft: '',
  furnishing: '',
  description: '',
  amenities: [],
  highlights: '',
  reraId: '',
};

function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function SellWizard({
  localities,
  action,
}: {
  localities: Locality[];
  action: (prevState: SellState, formData: FormData) => Promise<SellState>;
}) {
  const [state, formAction, isPending] = useActionState<SellState, FormData>(action, {});
  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormFields>(EMPTY);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [amenityDraft, setAmenityDraft] = useState('');

  const set = <K extends keyof FormFields>(key: K, value: FormFields[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  const localityName =
    localities.find((l) => l.slug === f.localitySlug)?.name ?? '';

  // ── Description generator (local template) ───────────────────────────
  function generateDescription() {
    const parts: string[] = [];
    const bhk = f.bhk ? `${f.bhk} BHK` : 'spacious';
    const furnish = f.furnishing ? `${f.furnishing} ` : '';
    const where = localityName || 'a sought-after Lucknow neighbourhood';
    const area = f.carpetAreaSqft
      ? `, offering ${Number(f.carpetAreaSqft).toLocaleString('en-IN')} sq ft of thoughtfully designed living space`
      : '';

    parts.push(
      `A ${bhk} ${furnish}home in ${where}${area}. Every corner has been crafted for comfortable, elevated living.`,
    );

    const counts: string[] = [];
    if (f.bedrooms) counts.push(`${f.bedrooms} bedroom${Number(f.bedrooms) === 1 ? '' : 's'}`);
    if (f.bathrooms) counts.push(`${f.bathrooms} bathroom${Number(f.bathrooms) === 1 ? '' : 's'}`);
    if (counts.length > 0) {
      parts.push(`The layout includes ${counts.join(' and ')}, with abundant natural light throughout.`);
    }

    if (f.amenities.length > 0) {
      parts.push(`Residents enjoy ${f.amenities.join(', ')}.`);
    }

    parts.push(
      f.listingType === 'rent'
        ? 'Move-in ready and available now — an effortless choice for discerning tenants.'
        : 'A rare opportunity to own a premium resale home in a connected, established locale.',
    );

    set('description', parts.join(' '));
  }

  // ── Per-step validation ──────────────────────────────────────────────
  function validateStep(current: number): boolean {
    const errs: Record<string, string> = {};
    if (current === 0) {
      if (!f.title.trim()) errs.title = 'Title is required.';
      if (!f.localitySlug) errs.localitySlug = 'Select a locality.';
      const priceNum = Number(f.price);
      if (!f.price.trim() || !Number.isFinite(priceNum) || priceNum < 0) {
        errs.price = 'Enter a valid price.';
      }
    }
    setStepErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStepErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  // ── Amenity chips ────────────────────────────────────────────────────
  function addAmenity() {
    const v = amenityDraft.trim();
    if (v && !f.amenities.includes(v)) set('amenities', [...f.amenities, v]);
    setAmenityDraft('');
  }
  function removeAmenity(a: string) {
    set('amenities', f.amenities.filter((x) => x !== a));
  }

  // ── Image URLs ───────────────────────────────────────────────────────
  function updateImage(i: number, value: string) {
    setImageUrls((prev) => prev.map((u, idx) => (idx === i ? value : u)));
  }
  function addImage() {
    setImageUrls((prev) => [...prev, '']);
  }
  function removeImage(i: number) {
    setImageUrls((prev) => (prev.length === 1 ? [''] : prev.filter((_, idx) => idx !== i)));
  }

  // ── Success screen ───────────────────────────────────────────────────
  if (state.ok) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-10 text-center ring-1 ring-black/5">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <PartyPopper className="size-7" aria-hidden />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink">Listing submitted!</h2>
        <p className="mt-2 max-w-md text-sm text-ink/60">
          Thanks for listing with Akshita Real Estate. Your property is now in our moderation
          queue. Our team will review it shortly, and once approved it will appear live on
          the site. You can track its status from your dashboard.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90"
          >
            Go to dashboard
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-black/5"
          >
            Browse properties
          </Link>
        </div>
      </div>
    );
  }

  const isLast = step === STEPS.length - 1;
  const serverErrs = state.fieldErrors ?? {};

  return (
    <form action={formAction}>
      {/* ── Step indicator ──────────────────────────────────────────── */}
      <ol className="mb-8 flex items-center justify-between gap-2">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ring-1 ${
                  done
                    ? 'bg-gold text-white ring-gold'
                    : active
                      ? 'bg-ink text-cream ring-ink'
                      : 'bg-white text-ink/40 ring-black/10'
                }`}
              >
                {done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  active ? 'text-ink' : 'text-ink/40'
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="ml-1 hidden h-px flex-1 bg-black/10 sm:block" />
              )}
            </li>
          );
        })}
      </ol>

      {state.error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-600/20">
          {state.error}
        </div>
      )}

      {/* category is fixed for the resell wizard */}
      <input type="hidden" name="category" value="resell" />

      {/* ── Step 1: Basics ──────────────────────────────────────────── */}
      <div className={step === 0 ? 'block' : 'hidden'}>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="font-display text-xl font-semibold text-ink">Basics</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Title" htmlFor="title" error={stepErrors.title ?? serverErrs.title} className="sm:col-span-2">
              <input
                id="title"
                name="title"
                value={f.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Sunlit 3 BHK in Gomti Nagar"
                className={inputCls}
              />
            </Field>

            <Field label="Listing type" htmlFor="listingType">
              <select
                id="listingType"
                name="listingType"
                value={f.listingType}
                onChange={(e) => set('listingType', e.target.value as 'sale' | 'rent')}
                className={inputCls}
              >
                <option value="sale">For sale</option>
                <option value="rent">For rent</option>
              </select>
            </Field>

            <Field label="Locality" htmlFor="localitySlug" error={stepErrors.localitySlug ?? serverErrs.localitySlug}>
              <select
                id="localitySlug"
                name="localitySlug"
                value={f.localitySlug}
                onChange={(e) => set('localitySlug', e.target.value)}
                className={inputCls}
              >
                <option value="">Select a locality…</option>
                {localities.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Price (₹)" htmlFor="price" error={stepErrors.price ?? serverErrs.price}>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                value={f.price}
                onChange={(e) => set('price', e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Furnishing" htmlFor="furnishing">
              <select
                id="furnishing"
                name="furnishing"
                value={f.furnishing}
                onChange={(e) => set('furnishing', e.target.value)}
                className={inputCls}
              >
                <option value="">—</option>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="furnished">Furnished</option>
              </select>
            </Field>

            <Field label="BHK" htmlFor="bhk">
              <input id="bhk" name="bhk" type="number" min={0} value={f.bhk} onChange={(e) => set('bhk', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Bedrooms" htmlFor="bedrooms">
              <input id="bedrooms" name="bedrooms" type="number" min={0} value={f.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Bathrooms" htmlFor="bathrooms">
              <input id="bathrooms" name="bathrooms" type="number" min={0} value={f.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Carpet area (sq ft)" htmlFor="carpetAreaSqft">
              <input id="carpetAreaSqft" name="carpetAreaSqft" type="number" min={0} value={f.carpetAreaSqft} onChange={(e) => set('carpetAreaSqft', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Built-up area (sq ft)" htmlFor="builtupAreaSqft">
              <input id="builtupAreaSqft" name="builtupAreaSqft" type="number" min={0} value={f.builtupAreaSqft} onChange={(e) => set('builtupAreaSqft', e.target.value)} className={inputCls} />
            </Field>
          </div>
        </div>
      </div>

      {/* ── Step 2: Details ─────────────────────────────────────────── */}
      <div className={step === 1 ? 'block' : 'hidden'}>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="font-display text-xl font-semibold text-ink">Details</h2>
          <div className="mt-5 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="description" className={labelCls}>Description</label>
                <button
                  type="button"
                  onClick={generateDescription}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold transition-colors hover:bg-gold/20"
                >
                  <Sparkles className="size-3.5" aria-hidden /> Generate description
                </button>
              </div>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={f.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe your property, or tap “Generate description” to draft one from your details."
                className={inputCls}
              />
            </div>

            {/* Amenities chips */}
            <div>
              <span className={labelCls}>Amenities</span>
              <div className="mt-1 flex gap-2">
                <input
                  value={amenityDraft}
                  onChange={(e) => setAmenityDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                  placeholder="e.g. Covered parking"
                  className={`${inputCls} mt-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="shrink-0 rounded-lg border border-black/10 px-3 text-sm font-medium text-ink transition-colors hover:bg-black/5"
                >
                  Add
                </button>
              </div>
              {f.amenities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {f.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1 text-xs text-ink/70"
                    >
                      {a}
                      <button type="button" onClick={() => removeAmenity(a)} aria-label={`Remove ${a}`}>
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {/* Serialized for the server action (comma-separated). */}
              <input type="hidden" name="amenities" value={f.amenities.join(', ')} />
            </div>

            <Field label="Highlights (one per line)" htmlFor="highlights">
              <textarea
                id="highlights"
                name="highlights"
                rows={3}
                value={f.highlights}
                onChange={(e) => set('highlights', e.target.value)}
                placeholder={'Corner unit\nClose to metro\nVaastu compliant'}
                className={inputCls}
              />
            </Field>

            <Field label="RERA ID (optional)" htmlFor="reraId">
              <input id="reraId" name="reraId" value={f.reraId} onChange={(e) => set('reraId', e.target.value)} className={inputCls} />
            </Field>
          </div>
        </div>
      </div>

      {/* ── Step 3: Photos ──────────────────────────────────────────── */}
      <div className={step === 2 ? 'block' : 'hidden'}>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="font-display text-xl font-semibold text-ink">Photos</h2>
          <p className="mt-1 text-sm text-ink/50">
            Paste image URLs (file upload comes with the live database).
          </p>
          <div className="mt-4 space-y-2">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="url"
                  name="imageUrl"
                  value={url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder="https://…"
                  className={`${inputCls} mt-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                  className="rounded-lg border border-black/10 p-2 text-ink/60 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"
            >
              <Plus className="size-4" /> Add image URL
            </button>
          </div>
        </div>
      </div>

      {/* ── Step 4: Review ──────────────────────────────────────────── */}
      <div className={step === 3 ? 'block' : 'hidden'}>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="font-display text-xl font-semibold text-ink">Review &amp; submit</h2>
          <p className="mt-1 text-sm text-ink/50">
            Check the details below. After submitting, your listing enters our moderation
            queue for review before going live.
          </p>
          <dl className="mt-5 divide-y divide-black/5 text-sm">
            {[
              ['Title', f.title || '—'],
              ['Listing type', f.listingType === 'rent' ? 'For rent' : 'For sale'],
              ['Locality', localityName || '—'],
              ['Price', f.price ? `₹${Number(f.price).toLocaleString('en-IN')}` : '—'],
              ['Configuration', [f.bhk && `${f.bhk} BHK`, f.bedrooms && `${f.bedrooms} bd`, f.bathrooms && `${f.bathrooms} ba`].filter(Boolean).join(' · ') || '—'],
              ['Carpet area', f.carpetAreaSqft ? `${Number(f.carpetAreaSqft).toLocaleString('en-IN')} sq ft` : '—'],
              ['Furnishing', f.furnishing || '—'],
              ['Amenities', f.amenities.length ? f.amenities.join(', ') : '—'],
              ['Photos', `${imageUrls.filter((u) => u.trim()).length} URL(s)`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-ink/50">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          {f.description && (
            <div className="mt-4 rounded-lg bg-cream/60 p-4 text-sm text-ink/70">
              {f.description}
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-black/5 disabled:opacity-40"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back
        </button>

        {isLast ? (
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90 disabled:opacity-60"
          >
            {isPending ? 'Submitting…' : 'Submit listing'}
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90"
          >
            Next <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </form>
  );
}
