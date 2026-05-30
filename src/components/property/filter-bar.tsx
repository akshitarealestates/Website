'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import type { Locality, PropertyFilters } from '@/lib/data/types';

const PRICE_OPTIONS = [
  { label: 'Any Price', value: '' },
  { label: 'Under ₹50L', value: 'max:5000000' },
  { label: '₹50L – 1Cr', value: 'min:5000000:max:10000000' },
  { label: '₹1Cr – 3Cr', value: 'min:10000000:max:30000000' },
  { label: '₹3Cr+', value: 'min:30000000' },
];

const BHK_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4+', value: '4' },
];

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'recent' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
];

interface FilterBarProps {
  localities: Locality[];
  current: PropertyFilters & { priceKey?: string };
}

/** Encode min/max price back to the SearchBar-style key for consistency */
function encodePriceKey(min?: number, max?: number): string {
  if (!min && !max) return '';
  const parts: string[] = [];
  if (min) parts.push(`min:${min}`);
  if (max) parts.push(`max:${max}`);
  return parts.join(':');
}

/** A rounded-full <select> styled as a soft pill, with a chevron affordance. */
function PillSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-full border border-black/8 bg-surface py-2.5 pl-4 pr-9 text-sm font-medium text-ink-soft outline-none transition-colors hover:border-ink/25 focus:border-gold focus:ring-2 focus:ring-gold/20"
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-muted"
      />
    </div>
  );
}

export function FilterBar({ localities, current }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handlePrice = useCallback(
    (priceKey: string) => {
      const params = new URLSearchParams(searchParams.toString());
      // clear both first
      params.delete('minPrice');
      params.delete('maxPrice');
      if (priceKey) {
        const parts = priceKey.split(':');
        for (let i = 0; i < parts.length; i += 2) {
          if (parts[i] === 'min') params.set('minPrice', parts[i + 1]);
          if (parts[i] === 'max') params.set('maxPrice', parts[i + 1]);
        }
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const priceKey = encodePriceKey(current.minPrice, current.maxPrice);
  const activeBhk = current.bhk != null ? String(current.bhk) : '';

  return (
    <div
      role="search"
      aria-label="Filter properties"
      className="flex flex-wrap items-center gap-3"
    >
      {/* Free-text query */}
      <div className="relative min-w-[200px] flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-muted"
        />
        <input
          id="filter-query"
          type="search"
          placeholder="Search by keyword or locality…"
          defaultValue={current.query ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateParam('query', (e.target as HTMLInputElement).value);
            }
          }}
          onBlur={(e) => updateParam('query', e.target.value)}
          className="w-full rounded-full border border-black/8 bg-surface py-2.5 pl-10 pr-4 text-sm text-ink-soft outline-none transition-colors placeholder:text-sand-muted/70 hover:border-ink/25 focus:border-gold focus:ring-2 focus:ring-gold/20"
          aria-label="Search by keyword"
        />
      </div>

      {/* Locality */}
      <PillSelect
        id="filter-locality"
        label="Location"
        value={current.localitySlug ?? ''}
        onChange={(v) => updateParam('localitySlug', v)}
      >
        <option value="">All locations</option>
        {localities.map((loc) => (
          <option key={loc.slug} value={loc.slug}>
            {loc.name}
          </option>
        ))}
      </PillSelect>

      {/* Price */}
      <PillSelect
        id="filter-price"
        label="Price"
        value={priceKey}
        onChange={handlePrice}
      >
        {PRICE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </PillSelect>

      {/* BHK — segmented pill control */}
      <div
        role="group"
        aria-label="Bedrooms"
        className="inline-flex items-center gap-1 rounded-full border border-black/8 bg-surface p-1"
      >
        <span className="px-2.5 text-[11px] font-medium uppercase tracking-wide text-sand-muted">
          BHK
        </span>
        {BHK_OPTIONS.map((opt) => {
          const isActive = activeBhk === opt.value;
          return (
            <button
              key={opt.value || 'any'}
              type="button"
              aria-pressed={isActive}
              onClick={() => updateParam('bhk', opt.value)}
              className={[
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ink text-cream'
                  : 'text-ink-soft hover:bg-ink/5',
              ].join(' ')}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Sort */}
      <PillSelect
        id="filter-sort"
        label="Sort"
        value={current.sort ?? 'recent'}
        onChange={(v) => updateParam('sort', v)}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </PillSelect>
    </div>
  );
}
