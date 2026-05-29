'use client';

import { useEffect, useState } from 'react';
import type { Property } from '@/lib/data/types';
import { recommendFromFavorites } from '@/lib/ai/recommend';
import { PropertyCard } from '@/components/property/property-card';

const STORAGE_KEY = 'akshita:favorites';

// AI-UPGRADE: replace the heuristic recommender with embedding-based similarity
// (Vercel AI SDK embeddings) computed server-side and personalised per user.
// See: https://sdk.vercel.ai/docs

function readFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function RecommendedForYou({ properties }: { properties: Property[] }) {
  const [mounted, setMounted] = useState(false);
  const [favSlugs, setFavSlugs] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    setFavSlugs(readFavorites());
  }, []);

  // Avoid hydration mismatch: render nothing until we've read localStorage.
  if (!mounted) return null;

  const recs = recommendFromFavorites(favSlugs, properties, 4);
  if (recs.length === 0) return null;

  const heading = favSlugs.length > 0 ? 'Recommended for you' : 'You might like';

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold text-ink">{heading}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recs.map((p) => (
          <PropertyCard key={p.slug} property={p} />
        ))}
      </div>
    </section>
  );
}
