import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { respond } from '@/lib/ai/concierge';
import { listLocalities, listProperties, createLead } from '@/lib/data/repo';
import { aiEnabled, aiModel } from '@/lib/ai/provider';

// AI-UPGRADE: WIRED. Intent + filters + lead capture stay rule-based (respond()).
// For conversational (non-search) turns we additionally generate a warmer reply via
// OpenRouter (Vercel AI SDK generateText), falling back to the rule-based reply on any
// error. A future pass can stream tokens with streamText. See src/lib/ai/provider.ts.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ConciergeRequest {
  message?: string;
  name?: string;
  phone?: string;
}

interface PropertyProjection {
  slug: string;
  title: string;
  price: number;
  localitySlug: string;
  image: string;
  bhk: number | null;
}

export async function POST(req: Request) {
  let body: ConciergeRequest;
  try {
    body = (await req.json()) as ConciergeRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const message = (body.message ?? '').trim();
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();

  const result = respond(message, { localities: listLocalities() });

  let reply = result.reply;
  let properties: PropertyProjection[] = [];

  // Attach matching listings when the concierge produced search filters.
  if (result.filters) {
    // Drop the raw conversational `query`: it is the whole chat sentence and the
    // repo's text filter would match it verbatim against title/description, yielding
    // nothing. The structured fields (bhk/category/locality/price) drive the search.
    const { query: _query, ...structured } = result.filters;
    properties = listProperties(structured)
      .slice(0, 3)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        price: p.price,
        localitySlug: p.localitySlug,
        image: p.images[0]?.url ?? '',
        bhk: p.bhk ?? null,
      }));
  }

  // For conversational (non-search) turns, generate a warmer reply with the LLM.
  // Search turns keep the concise rule-based reply since the listings carry the value.
  if (aiEnabled && !result.filters && !(name && phone)) {
    try {
      const { text } = await generateText({
        model: aiModel,
        system:
          "You are Akshita Realty's concierge for Lucknow real estate. " +
          'Be concise, warm, and helpful. Two or three sentences at most. ' +
          'You can help search listings, estimate valuations/EMI, share locality insight, ' +
          'and arrange site visits. Do not invent specific prices or listings.',
        prompt: message,
      });
      const warm = text.trim();
      if (warm) reply = warm;
    } catch {
      // Keep the rule-based reply on any LLM error.
    }
  }

  // Capture the lead whenever the visitor has supplied contact details. The widget
  // reveals name/phone fields once the concierge asks for them, and the visitor sends
  // them on a follow-up turn whose text may not re-match the contact intent — so we
  // capture on the presence of name + phone, not on result.captureLead alone.
  if (name && phone) {
    createLead({
      name,
      phone,
      message,
      sourceChannel: 'chatbot',
    });
    reply = `Thanks ${name}! One of our advisors will reach out at ${phone} shortly to help with your enquiry.`;
  }

  return NextResponse.json({ reply, properties });
}
