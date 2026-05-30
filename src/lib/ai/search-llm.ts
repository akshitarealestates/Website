// Server-only: imported only by the Node-runtime /api/ai/parse-search route.
import { generateObject } from 'ai';
import { z } from 'zod';
import type { PropertyFilters } from '@/lib/data/types';
import { parseSearch } from './parse-search';
import { aiEnabled, aiModel } from './provider';

const filtersSchema = z.object({
  category: z.enum(['commercial', 'resell', 'premium_project']).optional()
    .describe('Property category if clearly implied by the query'),
  listingType: z.enum(['sale', 'rent']).optional()
    .describe("'rent' for rentals/lease, otherwise omit (defaults to sale)"),
  localitySlug: z.string().optional()
    .describe('Slug of one of the provided localities, only if the user named it'),
  minPrice: z.number().optional().describe('Minimum price in rupees'),
  maxPrice: z.number().optional().describe('Maximum price in rupees (e.g. "80 lakh" = 8000000)'),
  bhk: z.number().int().optional().describe('Number of bedrooms (BHK)'),
});

/**
 * Natural-language → PropertyFilters using an LLM (OpenRouter via the AI SDK),
 * with a rule-based fallback. Server-only.
 */
export async function parseSearchLLM(
  query: string,
  localities: { name: string; slug: string }[],
): Promise<PropertyFilters> {
  if (!aiEnabled) {
    return parseSearch(query, localities);
  }

  try {
    const localityList = localities
      .map((l) => `- ${l.name} (slug: ${l.slug})`)
      .join('\n');

    const { object } = await generateObject({
      model: aiModel,
      schema: filtersSchema,
      system:
        'You map a natural-language real-estate search for Lucknow into structured filters.\n' +
        'Valid categories: commercial (offices/shops/retail/warehouse), resell (resale/second-hand homes), ' +
        'premium_project (new launches / under-construction projects).\n' +
        'Available localities (use the slug exactly, only if the user names that area):\n' +
        localityList +
        '\nPrices are in Indian rupees: 1 lakh = 100000, 1 crore = 10000000. ' +
        'Leave any field undefined when it is not clearly stated. Do not guess.',
      prompt: query,
    });

    // Keep the original text as `query` so downstream text filters still apply.
    return { ...object, query };
  } catch {
    return parseSearch(query, localities);
  }
}
