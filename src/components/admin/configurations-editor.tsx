'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { ProjectDetails } from '@/lib/data/types';

type Row = {
  type: string;
  sizeSqft: string;
  price: string;
  priceTo: string;
  availability: string;
  sizeLabel: string;
};

const inputCls =
  'rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20';

const emptyRow: Row = {
  type: '',
  sizeSqft: '',
  price: '',
  priceTo: '',
  availability: 'available',
  sizeLabel: '',
};

export function ConfigurationsEditor({
  initial,
}: {
  initial?: ProjectDetails['configurations'];
}) {
  const [rows, setRows] = useState<Row[]>(
    initial && initial.length > 0
      ? initial.map((c) => ({
          type: c.type,
          sizeSqft: String(c.sizeSqft),
          price: String(c.price),
          priceTo: c.priceTo != null ? String(c.priceTo) : '',
          availability: c.availability ?? 'available',
          sizeLabel: c.sizeLabel ?? '',
        }))
      : [{ ...emptyRow }],
  );

  function update(i: number, key: keyof Row, value: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  }
  function add() {
    setRows((prev) => [...prev, { ...emptyRow }]);
  }
  function remove(i: number) {
    setRows((prev) =>
      prev.length === 1 ? [{ ...emptyRow }] : prev.filter((_, idx) => idx !== i),
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div
          key={i}
          className="space-y-2 rounded-xl border border-black/5 bg-black/[0.015] p-3"
        >
          <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
            <input
              name="configType"
              value={row.type}
              onChange={(e) => update(i, 'type', e.target.value)}
              placeholder="Type (e.g. 3 BHK)"
              className={inputCls}
            />
            <input
              name="configSize"
              type="number"
              value={row.sizeSqft}
              onChange={(e) => update(i, 'sizeSqft', e.target.value)}
              placeholder="Size (sq ft)"
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove configuration"
              className="rounded-lg border border-black/10 p-2 text-ink/60 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <input
              name="configPrice"
              type="number"
              value={row.price}
              onChange={(e) => update(i, 'price', e.target.value)}
              placeholder="Price from (₹)"
              className={inputCls}
            />
            <input
              name="configPriceTo"
              type="number"
              value={row.priceTo}
              onChange={(e) => update(i, 'priceTo', e.target.value)}
              placeholder="Price to (₹)"
              className={inputCls}
            />
            <input
              name="configSizeLabel"
              value={row.sizeLabel}
              onChange={(e) => update(i, 'sizeLabel', e.target.value)}
              placeholder="Size label (e.g. 1,180–1,340 sq ft)"
              className={inputCls}
            />
            <select
              name="configAvailability"
              value={row.availability}
              onChange={(e) => update(i, 'availability', e.target.value)}
              className={inputCls}
            >
              <option value="available">Available</option>
              <option value="few_left">Few left</option>
              <option value="sold_out">Sold out</option>
            </select>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"
      >
        <Plus className="size-4" /> Add configuration
      </button>
    </div>
  );
}
