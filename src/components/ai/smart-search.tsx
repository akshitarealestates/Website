'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import { parseSearch } from '@/lib/ai/parse-search';

// AI-UPGRADE: replace parseSearch with a generateObject() call (Vercel AI SDK)
// that returns PropertyFilters from the NL query — use generateText + Output.object
// routed through the Vercel AI Gateway for auth, failover and cost tracking.
// See: https://sdk.vercel.ai/docs and https://vercel.com/docs/ai-gateway

interface SmartSearchProps {
  localities: { name: string; slug: string }[];
}

const EXAMPLE_CHIPS = [
  "3 BHK under ₹80L in Gomti Nagar",
  "Office space for rent",
  "New project under 3 Cr",
  "2 BHK resale flat",
];

export function SmartSearch({ localities }: SmartSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState('');

  function handleSearch() {
    const q = value.trim();
    if (!q) return;

    const filters = parseSearch(q, localities);

    const params = new URLSearchParams();
    if (filters.bhk !== undefined) params.set('bhk', String(filters.bhk));
    if (filters.category) params.set('category', filters.category);
    if (filters.listingType) params.set('listingType', filters.listingType);
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters.localitySlug) params.set('localitySlug', filters.localitySlug);
    if (filters.query) params.set('query', filters.query);

    router.push('/properties?' + params.toString());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <div className="w-full">
      {/* Input row */}
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 focus-within:border-white/40 transition-colors">
        <Sparkles className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your ideal property — e.g. 'spacious 3 BHK under ₹80L in Gomti Nagar'"
          className="flex-1 bg-transparent text-white placeholder:text-white/50 text-sm outline-none"
          aria-label="Natural language property search"
        />
        <button
          onClick={handleSearch}
          disabled={!value.trim()}
          className="shrink-0 rounded-xl bg-gold text-ink text-sm font-medium px-4 py-1.5 hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Search with natural language"
        >
          <span className="flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            Search
          </span>
        </button>
      </div>

      {/* Example chips */}
      <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Example searches">
        {EXAMPLE_CHIPS.map((chip) => (
          <button
            key={chip}
            role="listitem"
            onClick={() => setValue(chip)}
            className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/15 hover:text-white transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
