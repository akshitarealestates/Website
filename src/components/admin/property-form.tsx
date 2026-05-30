'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import type { Property, Locality, PropertyCategory } from '@/lib/data/types';
import type { FormState } from '@/app/admin/properties/actions';
import { ImageUrlList } from './image-url-list';
import { ConfigurationsEditor } from './configurations-editor';

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

export function PropertyForm({
  initial,
  localities,
  action,
}: {
  initial?: Property;
  localities: Locality[];
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, {});
  const errs = state.fieldErrors ?? {};

  const [category, setCategory] = useState<PropertyCategory>(
    initial?.category ?? 'resell',
  );
  const [listingType, setListingType] = useState(initial?.listingType ?? 'sale');

  const isPremium = category === 'premium_project';
  const isRent = listingType === 'rent';

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-600/20">
          {state.error}
        </div>
      )}

      {/* ── Basics ─────────────────────────────────────────────────── */}
      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" name="title" error={errs.title} className="sm:col-span-2">
            <input
              id="title"
              name="title"
              defaultValue={initial?.title ?? ''}
              className={inputCls}
              required
            />
          </Field>

          <Field label="Category" name="category" error={errs.category}>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as PropertyCategory)}
              className={inputCls}
            >
              <option value="commercial">Commercial</option>
              <option value="resell">Resell</option>
              <option value="premium_project">Premium Project</option>
            </select>
          </Field>

          <Field label="Listing type" name="listingType">
            <select
              id="listingType"
              name="listingType"
              value={listingType}
              onChange={(e) => setListingType(e.target.value as 'sale' | 'rent')}
              className={inputCls}
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </Field>

          <Field label="Price (₹)" name="price" error={errs.price}>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              defaultValue={initial?.price ?? ''}
              className={inputCls}
              required
            />
          </Field>

          {isRent && (
            <Field label="Price period" name="pricePeriod">
              <select
                id="pricePeriod"
                name="pricePeriod"
                defaultValue={initial?.pricePeriod ?? 'month'}
                className={inputCls}
              >
                <option value="month">Per month</option>
                <option value="year">Per year</option>
              </select>
            </Field>
          )}

          <Field label="Status" name="status">
            <select
              id="status"
              name="status"
              defaultValue={initial?.status ?? 'draft'}
              className={inputCls}
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="sold">Sold</option>
              <option value="rejected">Rejected</option>
            </select>
          </Field>

          <label className="flex items-center gap-2 self-end pb-2 text-sm text-ink">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={initial?.isFeatured ?? false}
              className="size-4 rounded border-black/20 text-gold focus:ring-gold/30"
            />
            Featured listing
          </label>
        </div>
      </Section>

      {/* ── Specifications ─────────────────────────────────────────── */}
      <Section title="Specifications">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="BHK" name="bhk">
            <input id="bhk" name="bhk" type="number" min={0} defaultValue={initial?.bhk ?? ''} className={inputCls} />
          </Field>
          <Field label="Bedrooms" name="bedrooms">
            <input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={initial?.bedrooms ?? ''} className={inputCls} />
          </Field>
          <Field label="Bathrooms" name="bathrooms">
            <input id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={initial?.bathrooms ?? ''} className={inputCls} />
          </Field>
          <Field label="Carpet area (sq ft)" name="carpetAreaSqft">
            <input id="carpetAreaSqft" name="carpetAreaSqft" type="number" min={0} defaultValue={initial?.carpetAreaSqft ?? ''} className={inputCls} />
          </Field>
          <Field label="Built-up area (sq ft)" name="builtupAreaSqft">
            <input id="builtupAreaSqft" name="builtupAreaSqft" type="number" min={0} defaultValue={initial?.builtupAreaSqft ?? ''} className={inputCls} />
          </Field>
          <Field label="Furnishing" name="furnishing">
            <select id="furnishing" name="furnishing" defaultValue={initial?.furnishing ?? ''} className={inputCls}>
              <option value="">—</option>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="furnished">Furnished</option>
            </select>
          </Field>
          <Field label="Floor" name="floor">
            <input id="floor" name="floor" type="number" defaultValue={initial?.floor ?? ''} className={inputCls} />
          </Field>
          <Field label="Total floors" name="totalFloors">
            <input id="totalFloors" name="totalFloors" type="number" min={0} defaultValue={initial?.totalFloors ?? ''} className={inputCls} />
          </Field>
          <Field label="RERA ID" name="reraId">
            <input id="reraId" name="reraId" defaultValue={initial?.reraId ?? ''} className={inputCls} />
          </Field>
        </div>
      </Section>

      {/* ── Location ──────────────────────────────────────────────── */}
      <Section title="Location">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Locality" name="localitySlug" error={errs.localitySlug}>
            <select
              id="localitySlug"
              name="localitySlug"
              defaultValue={initial?.localitySlug ?? ''}
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
          <Field label="Address" name="address">
            <input id="address" name="address" defaultValue={initial?.address ?? ''} className={inputCls} />
          </Field>
          <Field label="Latitude" name="latitude">
            <input id="latitude" name="latitude" type="number" step="any" defaultValue={initial?.latitude ?? ''} className={inputCls} />
          </Field>
          <Field label="Longitude" name="longitude">
            <input id="longitude" name="longitude" type="number" step="any" defaultValue={initial?.longitude ?? ''} className={inputCls} />
          </Field>
        </div>
      </Section>

      {/* ── Details ───────────────────────────────────────────────── */}
      <Section title="Details">
        <div className="space-y-4">
          <Field label="Description" name="description">
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={initial?.description ?? ''}
              className={inputCls}
            />
          </Field>
          <Field label="Highlights (one per line)" name="highlights">
            <textarea
              id="highlights"
              name="highlights"
              rows={3}
              defaultValue={(initial?.highlights ?? []).join('\n')}
              className={inputCls}
            />
          </Field>
          <Field label="Amenities (comma-separated)" name="amenities">
            <input
              id="amenities"
              name="amenities"
              defaultValue={(initial?.amenities ?? []).join(', ')}
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* ── Images ────────────────────────────────────────────────── */}
      <Section title="Images" description="Add image URLs. Leave empty to auto-generate a placeholder.">
        <ImageUrlList initial={initial?.images?.map((i) => i.url)} />
      </Section>

      {/* ── Premium project ───────────────────────────────────────── */}
      {isPremium && (
        <Section title="Project details" description="Shown for premium projects only.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Developer name" name="developerName">
              <input id="developerName" name="developerName" defaultValue={initial?.project?.developerName ?? ''} className={inputCls} />
            </Field>
            <Field label="Possession date" name="possessionDate">
              <input id="possessionDate" name="possessionDate" type="date" defaultValue={initial?.project?.possessionDate ?? ''} className={inputCls} />
            </Field>
            <Field label="Launch status" name="launchStatus">
              <input id="launchStatus" name="launchStatus" defaultValue={initial?.project?.launchStatus ?? ''} placeholder="e.g. New Launch / Ready to Move" className={inputCls} />
            </Field>
            <Field label="Project status" name="projectStatus">
              <input id="projectStatus" name="projectStatus" defaultValue={initial?.project?.projectStatus ?? ''} placeholder="e.g. Under construction" className={inputCls} />
            </Field>
            <Field label="Project RERA ID" name="projectReraId">
              <input id="projectReraId" name="projectReraId" defaultValue={initial?.project?.reraId ?? ''} className={inputCls} />
            </Field>
            <Field label="Total units" name="totalUnits">
              <input id="totalUnits" name="totalUnits" type="number" min={0} defaultValue={initial?.project?.totalUnits ?? ''} className={inputCls} />
            </Field>
          </div>

          <div className="mt-4 space-y-4">
            <Field label="About (overview)" name="about">
              <textarea
                id="about"
                name="about"
                rows={3}
                defaultValue={initial?.project?.about ?? ''}
                className={inputCls}
              />
            </Field>
            <Field label="Extended amenities (one per line)" name="amenitiesExtended">
              <textarea
                id="amenitiesExtended"
                name="amenitiesExtended"
                rows={4}
                defaultValue={(initial?.project?.amenitiesExtended ?? []).join('\n')}
                className={inputCls}
              />
            </Field>
            <Field label="Location highlights (one per line)" name="locationHighlights">
              <textarea
                id="locationHighlights"
                name="locationHighlights"
                rows={3}
                defaultValue={(initial?.project?.locationHighlights ?? []).join('\n')}
                className={inputCls}
              />
            </Field>
            <Field label="Gallery image URLs (one per line)" name="gallery">
              <textarea
                id="gallery"
                name="gallery"
                rows={3}
                defaultValue={(initial?.project?.gallery ?? []).join('\n')}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="mt-4">
            <p className={labelCls}>Configurations</p>
            <div className="mt-2">
              <ConfigurationsEditor initial={initial?.project?.configurations} />
            </div>
          </div>
        </Section>
      )}

      {/* ── Actions ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : initial ? 'Save changes' : 'Create property'}
        </button>
        <Link
          href="/admin/properties"
          className="inline-flex items-center rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-black/5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
