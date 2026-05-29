import type { PropertyFilters } from '@/lib/data/types';
import { parseSearch } from './parse-search';

// AI-UPGRADE: replace respond() with a streaming AI SDK agent (tools: searchListings, getLocalityInfo, createLead).
// Use the Vercel AI SDK (streamText + tools) routed through the Vercel AI Gateway for
// auth, failover and cost tracking. See: https://sdk.vercel.ai/docs and https://vercel.com/docs/ai-gateway

export interface ConciergeContext {
  localities: { name: string; slug: string }[];
}

export interface ConciergeResult {
  reply: string;
  filters?: PropertyFilters;
  captureLead?: boolean;
}

const NUDGE = ' How else can I help?';

const GREETING_RE = /\b(hi|hello|hey|hiya|namaste|good (morning|afternoon|evening))\b/i;
const SEARCH_RE =
  /\b(find|show|looking for|look for|want|search|searching|browse|properties|property|flat|flats|apartment|apartments|house|houses|villa|plot|office|shop)\b/i;
const BHK_RE = /\d+\s*(bhk|bedroom|bed)\b/i;
const LOCALITY_INTENT_RE = /\b(about|area|areas|locality|neighbou?rhood|how is|how's|tell me)\b/i;
const PRICE_RE = /\b(price|prices|emi|loan|budget|afford|cost|valuation|worth|mortgage)\b/i;
const CONTACT_RE =
  /\b(contact|agent|visit|call|site visit|talk|speak|schedule|book|appointment|connect|reach)\b/i;

/**
 * Rule-based AI concierge. Returns a reply plus optional structured intents
 * (search filters, lead capture) that the API route enriches with real data.
 */
export function respond(message: string, ctx: ConciergeContext): ConciergeResult {
  const text = (message ?? '').trim();
  const lower = text.toLowerCase();

  // Detect a known locality mentioned anywhere in the message.
  const matchedLocality = ctx.localities.find((l) =>
    lower.includes(l.name.toLowerCase()),
  );

  // ── Greeting ───────────────────────────────────────────────────────────
  if (GREETING_RE.test(lower) && !SEARCH_RE.test(lower) && !BHK_RE.test(lower)) {
    return {
      reply:
        "Hi! I'm the Akshita Realty concierge. I can help you search listings, " +
        'estimate a property valuation, or arrange a site visit.' +
        NUDGE,
    };
  }

  // ── Locality question ──────────────────────────────────────────────────
  // A known locality name combined with a "tell me about the area" style intent.
  if (matchedLocality && LOCALITY_INTENT_RE.test(lower) && !BHK_RE.test(lower)) {
    return {
      reply:
        `${matchedLocality.name} is one of Lucknow's sought-after pockets — known for its ` +
        'connectivity, amenities, and steady appreciation. I can pull up current ' +
        `listings and local insights for ${matchedLocality.name} whenever you like.` +
        NUDGE,
    };
  }

  // ── Contact / visit / talk to an agent ─────────────────────────────────
  // Checked before the broad search intent so "I want to talk to an agent"
  // captures a lead rather than triggering a listing search.
  if (CONTACT_RE.test(lower)) {
    return {
      reply:
        "I'd be happy to connect you with one of our advisors. Could you share your " +
        'name and phone number so we can reach out and schedule a visit?',
      captureLead: true,
    };
  }

  // ── Price / EMI / budget guidance ──────────────────────────────────────
  if (PRICE_RE.test(lower)) {
    return {
      reply:
        'For budgeting, try our EMI calculator to estimate monthly payments, and the ' +
        'free valuation tool to see what a property is worth. Tell me your budget and ' +
        'preferred area and I can shortlist options.' +
        NUDGE,
    };
  }

  // ── Search intent ──────────────────────────────────────────────────────
  if (SEARCH_RE.test(lower) || BHK_RE.test(lower)) {
    return {
      reply: 'Here are some options matching your search:' + NUDGE,
      filters: parseSearch(text, ctx.localities),
    };
  }

  // ── Fallback menu ──────────────────────────────────────────────────────
  return {
    reply:
      "I'm here to help! You can ask me to: search listings (e.g. \"3 BHK in Gomti Nagar " +
      'under 80 lakh"), learn about a locality, estimate EMI or a property valuation, or ' +
      'talk to an advisor for a site visit.' +
      NUDGE,
  };
}
