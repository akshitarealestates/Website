import type { PropertyFilters } from '@/lib/data/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const LAKH = 1_00_000;
const CRORE = 1_00_00_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse a price string like "80 lakh", "1.5 cr", "50l", "3 crore" → number */
function parsePrice(value: string, unit: string): number {
  const n = parseFloat(value);
  if (isNaN(n)) return 0;
  const u = unit.toLowerCase();
  if (/^(crore|cr)$/.test(u)) return Math.round(n * CRORE);
  if (/^(lakh|lac|l)$/.test(u)) return Math.round(n * LAKH);
  return 0;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Rule-based natural-language → PropertyFilters parser.
 *
 * AI-UPGRADE: replace this entire function body with a structured-output call via
 * the Vercel AI SDK (generateText + Output.object) so the model returns PropertyFilters
 * directly from the NL query.  Pass `localities` as context so the model can resolve
 * locality names to slugs.  Route through the Vercel AI Gateway for auth, failover
 * and cost tracking.  See: https://sdk.vercel.ai/docs and https://vercel.com/docs/ai-gateway
 */
export function parseSearch(
  query: string,
  localities: { name: string; slug: string }[],
): PropertyFilters {
  const q = query.trim();
  const lower = q.toLowerCase();

  const filters: PropertyFilters = { query: q };

  // ── BHK ──────────────────────────────────────────────────────────────────
  const bhkMatch = lower.match(/(\d+)\s*(bhk|bedroom|bed)/i);
  if (bhkMatch) {
    filters.bhk = parseInt(bhkMatch[1], 10);
  }

  // ── Category ─────────────────────────────────────────────────────────────
  if (/\b(office|shops?|commercial|retail|warehouse|showroom)\b/i.test(lower)) {
    filters.category = 'commercial';
  } else if (/\b(resale|resell|second[\s-]?hand)\b/i.test(lower)) {
    filters.category = 'resell';
  } else if (
    /\b(project|new\s+launch|under\s+construction|new\s+project)\b/i.test(lower)
  ) {
    filters.category = 'premium_project';
  }

  // ── Listing type ─────────────────────────────────────────────────────────
  if (/\b(rent|rental|lease|renting)\b/i.test(lower)) {
    filters.listingType = 'rent';
  }

  // ── Price (maxPrice) ─────────────────────────────────────────────────────
  // Patterns: "under|below|budget|upto|up to <num> <unit>" or bare "<num> cr/lakh"
  const pricePattern =
    /(?:under|below|budget|upto|up\s+to)\s+([\d.]+)\s*(crore|cr|lakh|lac|l)\b/i;
  const barePattern = /\b([\d.]+)\s*(crore|cr|lakh|lac|l)\b/i;

  const priceMatch = lower.match(pricePattern) ?? lower.match(barePattern);
  if (priceMatch) {
    const price = parsePrice(priceMatch[1], priceMatch[2]);
    if (price > 0) filters.maxPrice = price;
  }

  // ── Locality ─────────────────────────────────────────────────────────────
  for (const loc of localities) {
    if (lower.includes(loc.name.toLowerCase())) {
      filters.localitySlug = loc.slug;
      break;
    }
  }

  return filters;
}
