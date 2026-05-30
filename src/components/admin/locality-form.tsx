'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import type { Locality } from '@/lib/data/types';
import type { LocalityFormState } from '@/app/admin/localities/actions';
import { slugify } from '@/lib/data/repo';

const labelCls = 'block text-xs font-medium uppercase tracking-wide text-ink/50';
const inputCls =
  'mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20';

function Field({
  label,
  name,
  children,
  error,
  className,
}: {
  label: string;
  name?: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl bg-white p-5 ring-1 ring-black/5">
      <legend className="px-1 font-display text-base font-semibold text-ink">{title}</legend>
      {description && <p className="mb-4 text-sm text-ink/50">{description}</p>}
      <div className={description ? '' : 'mt-3'}>{children}</div>
    </fieldset>
  );
}

export function LocalityForm({
  initial,
  action,
}: {
  initial?: Locality;
  action: (prevState: LocalityFormState, formData: FormData) => Promise<LocalityFormState>;
}) {
  const [state, formAction, isPending] = useActionState<LocalityFormState, FormData>(
    action,
    {},
  );
  const errs = state.fieldErrors ?? {};

  const [slugValue, setSlugValue] = useState(initial?.slug ?? '');

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Only auto-suggest slug when creating (no initial), and only if the user
    // hasn't manually edited the slug field yet.
    if (!initial) {
      setSlugValue(slugify(e.target.value));
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-600/20">
          {state.error}
        </div>
      )}

      {/* ── Identity ─────────────────────────────────────────────── */}
      <Section title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" error={errs.name}>
            <input
              id="name"
              name="name"
              defaultValue={initial?.name ?? ''}
              onChange={handleNameChange}
              className={inputCls}
              required
            />
          </Field>

          <Field label="Slug" name="slug">
            <input
              id="slug"
              name="slug"
              value={slugValue}
              onChange={(e) => setSlugValue(e.target.value)}
              placeholder="auto-generated from name"
              className={inputCls}
            />
          </Field>

          <Field label="City" name="city">
            <input
              id="city"
              name="city"
              defaultValue={initial?.city ?? 'Lucknow'}
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <Section title="Content">
        <div className="space-y-4">
          <Field label="Description" name="description">
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={initial?.description ?? ''}
              placeholder="Public-facing description of this neighbourhood…"
              className={inputCls}
            />
          </Field>

          <Field
            label="AI Insights"
            name="aiInsights"
            className=""
          >
            <textarea
              id="aiInsights"
              name="aiInsights"
              rows={5}
              defaultValue={initial?.aiInsights ?? ''}
              placeholder="AI-generated investment and livability insights…"
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* ── Market data ──────────────────────────────────────────── */}
      <Section title="Market data">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Avg price / sq ft (₹)" name="avgPricePerSqft">
            <input
              id="avgPricePerSqft"
              name="avgPricePerSqft"
              type="number"
              min={0}
              step={100}
              defaultValue={initial?.avgPricePerSqft ?? 6000}
              className={inputCls}
            />
          </Field>

          <Field label="Latitude" name="latitude">
            <input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              defaultValue={initial?.latitude ?? ''}
              className={inputCls}
            />
          </Field>

          <Field label="Longitude" name="longitude">
            <input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              defaultValue={initial?.longitude ?? ''}
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* ── Actions ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : initial ? 'Save changes' : 'Create locality'}
        </button>
        <Link
          href="/admin/localities"
          className="inline-flex items-center rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-black/5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
