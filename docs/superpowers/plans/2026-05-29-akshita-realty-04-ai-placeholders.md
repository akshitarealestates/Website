# Akshita Realty — Plan 4: AI Features (Functional Placeholders)

> REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Ship the AI-flavored features as working, premium placeholders that function today with rule-based/data logic and are structured for a clean later swap to real LLM calls (Vercel AI SDK + AI Gateway). No external AI keys required now.

**Architecture:** Pure, tested logic in `src/lib/ai/*` (search parsing, recommendations, chatbot intent). UI islands consume them. A clear `// AI-UPGRADE:` comment marks each spot where a real model call replaces the placeholder. Lead-capturing features write through `createLead`.

**Already functional from earlier plans (no rework):** price valuation engine (`estimateValuation`), EMI calculator, similar-properties (`listSimilar`), locality insights (data-driven), auto listing-writer (local template in the sell wizard).

---

## Group 4.1 — Conversational search + valuation tool
- `src/lib/ai/parse-search.ts` (pure, TDD): `parseSearch(query: string): PropertyFilters` — rule-based extraction:
  - BHK: `/(\d+)\s*(bhk|bedroom|bed)/i` → `bhk`.
  - category: office/shop/commercial/retail/warehouse→`commercial`; resale/resell/second-hand→`resell`; project/new launch/under construction→`premium_project`.
  - listingType: rent/rental/lease→`rent`.
  - price: parse "under/below/budget X (lakh|l|crore|cr)" → `maxPrice` (lakh=1e5, crore=1e7; e.g. "under 80 lakh"→8000000, "1.5 cr"→15000000).
  - locality: match locality names from a provided list (case-insensitive substring) → `localitySlug`.
  - leftover words → `query`.
  Provide tests for ~6 phrases (e.g. "spacious 3 bhk under 80 lakh in gomti nagar", "office space for rent hazratganj", "new project sushant golf city under 3 cr").
- `src/components/ai/smart-search.tsx` (client): a prominent NL search input ("Describe your ideal property…") with example chips; on submit, calls `parseSearch` (pass localities) and `router.push('/properties?'+params)`. Place it on the home hero (alongside or replacing the structured SearchBar — keep both: structured bar + a "Or describe it in words" smart input) and atop `/properties`.
- `src/app/valuation/page.tsx` + `src/components/ai/valuation-tool.tsx` (client) + `src/app/valuation/actions.ts`: a "What's my property worth?" tool — inputs locality, area sqft, bhk, type → calls `estimateValuation` (via a server action or imported pure fn) → shows the ₹ range + `basis` + a short generated explanation (template now, `// AI-UPGRADE`), and a "Get a precise valuation" form that calls `createLead({ sourceChannel:'valuation' })` + records via `createLead`. Link to it from the home page and footer ("Sell" area).
- Acceptance: `parseSearch` tests pass; smart search navigates with correct filters; valuation returns a band and captures a lead; build green.

## Group 4.2 — Concierge chatbot + recommendations
- `src/lib/ai/concierge.ts` (pure, TDD): `respond(message: string, ctx): { reply: string; suggestions?: Property[]; captureLead?: boolean }` — rule-based intents: greeting; "show me / find" → parse via `parseSearch` and return top matches; locality questions → return locality insights; price/EMI → guidance; "contact/agent/visit" → set `captureLead`. Always end with a helpful nudge. Test ~5 intents.
- `src/components/ai/concierge-widget.tsx` (client): a floating button (bottom-right) opening a chat panel; maintains message list in state; calls a route handler `src/app/api/concierge/route.ts` (POST) that runs `respond(...)` server-side and may `createLead` (sourceChannel 'chatbot') when contact info is provided; renders suggested `PropertyCard`s inline. Mount the widget in the root layout (visible site-wide, but NOT on `/admin`). Include a `// AI-UPGRADE` note in the route showing where to call the AI SDK streaming agent.
- `src/lib/ai/recommend.ts` (pure, TDD): `recommendFromFavorites(favSlugs: string[], all: Property[], limit): Property[]` — derive preferred categories/localities/price-band from favorites and rank others; fallback to featured if no favorites. Test it.
- `src/components/ai/recommended-for-you.tsx` (client): reads `localStorage 'akshita:favorites'`, calls `recommendFromFavorites` over a passed-in property list, renders a "Recommended for you" row; hidden if it would duplicate featured with no favorites (or show featured as a sensible default). Place on the dashboard and optionally home.
- Acceptance: chatbot answers the test intents and can capture a lead; recommendations react to favorites; build green.

---

## Cross-cutting acceptance
- `npx tsc --noEmit` clean; `npm test` green (new AI logic tests included); `npm run build` passes.
- Chatbot NOT shown on `/admin`. No external API keys needed. Premium, on-brand UI.
- Every placeholder marks its real-AI swap point with `// AI-UPGRADE:` and a one-line note (model + AI SDK function to use).
