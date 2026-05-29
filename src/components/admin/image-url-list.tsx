'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export function ImageUrlList({ initial }: { initial?: string[] }) {
  const [urls, setUrls] = useState<string[]>(
    initial && initial.length > 0 ? initial : [''],
  );

  function update(i: number, value: string) {
    setUrls((prev) => prev.map((u, idx) => (idx === i ? value : u)));
  }
  function add() {
    setUrls((prev) => [...prev, '']);
  }
  function remove(i: number) {
    setUrls((prev) => (prev.length === 1 ? [''] : prev.filter((_, idx) => idx !== i)));
  }

  return (
    <div className="space-y-2">
      {urls.map((url, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="url"
            name="imageUrl"
            value={url}
            onChange={(e) => update(i, e.target.value)}
            placeholder="https://…"
            className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove image"
            className="rounded-lg border border-black/10 p-2 text-ink/60 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"
      >
        <Plus className="size-4" /> Add image URL
      </button>
    </div>
  );
}
