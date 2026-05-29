'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { Locality, PropertyFilters } from '@/lib/data/types';

const PRICE_OPTIONS = [
  { label: 'Any Price', value: '' },
  { label: 'Under ₹50L', value: 'max:5000000' },
  { label: '₹50L – 1Cr', value: 'min:5000000:max:10000000' },
  { label: '₹1Cr – 3Cr', value: 'min:10000000:max:30000000' },
  { label: '₹3Cr+', value: 'min:30000000' },
];

const BHK_OPTIONS = [
  { label: 'Any BHK', value: '' },
  { label: '1 BHK', value: '1' },
  { label: '2 BHK', value: '2' },
  { label: '3 BHK', value: '3' },
  { label: '4+ BHK', value: '4' },
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

  const selectClass =
    'flex-1 min-w-[130px] bg-white border border-black/10 rounded-xl text-sm text-ink/80 outline-none cursor-pointer py-2 px-3 appearance-none hover:border-ink/30 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors';

  return (
    <div
      role="search"
      aria-label="Filter properties"
      className="flex flex-wrap gap-3 items-end"
    >
      {/* Locality */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-locality" className="text-xs text-ink/50 uppercase tracking-wide">
          Location
        </label>
        <select
          id="filter-locality"
          value={current.localitySlug ?? ''}
          onChange={(e) => updateParam('localitySlug', e.target.value)}
          className={selectClass}
        >
          <option value="">All Locations</option>
          {localities.map((loc) => (
            <option key={loc.slug} value={loc.slug}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-price" className="text-xs text-ink/50 uppercase tracking-wide">
          Price
        </label>
        <select
          id="filter-price"
          value={priceKey}
          onChange={(e) => handlePrice(e.target.value)}
          className={selectClass}
        >
          {PRICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* BHK */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-bhk" className="text-xs text-ink/50 uppercase tracking-wide">
          BHK
        </label>
        <select
          id="filter-bhk"
          value={current.bhk != null ? String(current.bhk) : ''}
          onChange={(e) => updateParam('bhk', e.target.value)}
          className={selectClass}
        >
          {BHK_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-sort" className="text-xs text-ink/50 uppercase tracking-wide">
          Sort
        </label>
        <select
          id="filter-sort"
          value={current.sort ?? 'recent'}
          onChange={(e) => updateParam('sort', e.target.value)}
          className={selectClass}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Free-text query */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-query" className="text-xs text-ink/50 uppercase tracking-wide">
          Search
        </label>
        <input
          id="filter-query"
          type="search"
          placeholder="Keyword, locality…"
          defaultValue={current.query ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateParam('query', (e.target as HTMLInputElement).value);
            }
          }}
          onBlur={(e) => updateParam('query', e.target.value)}
          className="min-w-[180px] bg-white border border-black/10 rounded-xl text-sm text-ink/80 outline-none py-2 px-3 hover:border-ink/30 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors placeholder:text-ink/30"
          aria-label="Search by keyword"
        />
      </div>
    </div>
  );
}
