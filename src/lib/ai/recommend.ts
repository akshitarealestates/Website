import type { Property } from '@/lib/data/types';

// AI-UPGRADE: replace the heuristic scoring below with embedding-based similarity
// (embed favorited listings + candidates via the Vercel AI SDK `embed`/`embedMany`
// helpers, rank by cosine similarity) routed through the Vercel AI Gateway.
// See: https://sdk.vercel.ai/docs

function published(all: Property[]): Property[] {
  return all.filter((p) => p.status === 'published');
}

/** Most frequent value in a list, or undefined when the list is empty. */
function mostFrequent<T>(values: T[]): T | undefined {
  const counts = new Map<T, number>();
  let best: T | undefined;
  let bestCount = 0;
  for (const v of values) {
    const next = (counts.get(v) ?? 0) + 1;
    counts.set(v, next);
    if (next > bestCount) {
      bestCount = next;
      best = v;
    }
  }
  return best;
}

/**
 * Recommend properties based on a user's favorited slugs.
 *
 * With no favorites, returns featured listings (falling back to the first N
 * published). With favorites, derives the dominant category, the set of
 * favorited localities, and the average favorited price, then scores the
 * remaining published listings by category match + locality match + price
 * proximity and returns the top `limit`.
 */
export function recommendFromFavorites(
  favSlugs: string[],
  all: Property[],
  limit = 4,
): Property[] {
  const pub = published(all);

  // ── Cold start: no favorites ──────────────────────────────────────────
  if (!favSlugs || favSlugs.length === 0) {
    const featured = pub.filter((p) => p.isFeatured);
    const base = featured.length > 0 ? featured : pub;
    return base.slice(0, limit);
  }

  const favSet = new Set(favSlugs);
  const favorites = pub.filter((p) => favSet.has(p.slug));

  // If favorites don't resolve to published properties, treat as cold start.
  if (favorites.length === 0) {
    const featured = pub.filter((p) => p.isFeatured);
    const base = featured.length > 0 ? featured : pub;
    return base.slice(0, limit);
  }

  const dominantCategory = mostFrequent(favorites.map((p) => p.category));
  const favLocalities = new Set(favorites.map((p) => p.localitySlug));
  const avgPrice =
    favorites.reduce((sum, p) => sum + p.price, 0) / favorites.length;

  const candidates = pub.filter((p) => !favSet.has(p.slug));

  const scored = candidates.map((p) => {
    let score = 0;
    if (dominantCategory && p.category === dominantCategory) score += 1000;
    if (favLocalities.has(p.localitySlug)) score += 500;
    // Price proximity: closer to the average favorited price scores higher.
    const priceDiff = Math.abs(p.price - avgPrice);
    const proximity = avgPrice > 0 ? 1 - Math.min(priceDiff / avgPrice, 1) : 0;
    score += proximity * 250;
    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}
