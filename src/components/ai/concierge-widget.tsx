'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send } from 'lucide-react';

// AI-UPGRADE: swap the fetch + JSON exchange for a streaming chat hook (e.g. the
// Vercel AI SDK `useChat`) so assistant tokens render as they arrive.
// See: https://sdk.vercel.ai/docs

interface PropertyHit {
  slug: string;
  title: string;
  price: number;
  localitySlug: string;
  image: string;
  bhk: number | null;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  properties?: PropertyHit[];
}

const CRORE = 1_00_00_000;
const LAKH = 1_00_000;

function formatINR(amount: number): string {
  if (amount >= CRORE) return `₹${parseFloat((amount / CRORE).toFixed(2))} Cr`;
  if (amount >= LAKH) return `₹${parseFloat((amount / LAKH).toFixed(2))} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm the Akshita Real Estate concierge. I can help you search listings, estimate a valuation, or arrange a site visit. What are you looking for?",
};

// Heuristic: the assistant is requesting contact details.
function asksForContact(reply: string): boolean {
  return /name and phone|share your name|connect you/i.test(reply);
}

export function ConciergeWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [needContact, setNeedContact] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Greet on first open.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([GREETING]);
    }
  }, [open, messages.length]);

  // Keep the latest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Hidden on admin routes (mounted site-wide via the root layout).
  if (pathname?.startsWith('/admin')) return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: text,
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { reply: string; properties?: PropertyHit[] };

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          properties: data.properties && data.properties.length > 0 ? data.properties : undefined,
        },
      ]);

      if (asksForContact(data.reply)) {
        setNeedContact(true);
      } else if (needContact && name.trim() && phone.trim()) {
        // Lead just captured — clear the form.
        setNeedContact(false);
        setName('');
        setPhone('');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close concierge chat' : 'Open concierge chat'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-ink text-cream shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {open ? <X className="size-6" aria-hidden /> : <MessageCircle className="size-6" aria-hidden />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Akshita Real Estate concierge"
          className="fixed bottom-24 right-5 z-50 flex max-h-[70vh] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-ink px-4 py-3 text-cream">
            <span className="flex size-8 items-center justify-center rounded-full bg-gold/20 text-gold">
              <MessageCircle className="size-4" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold">Akshita Concierge</p>
              <p className="text-xs text-cream/60">Typically replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className="max-w-[85%]">
                  <div
                    className={
                      m.role === 'user'
                        ? 'rounded-2xl rounded-br-sm bg-ink px-3.5 py-2 text-sm text-cream'
                        : 'rounded-2xl rounded-bl-sm bg-cream px-3.5 py-2 text-sm text-ink'
                    }
                  >
                    {m.content}
                  </div>

                  {/* Property cards */}
                  {m.properties && (
                    <div className="mt-2 space-y-2">
                      {m.properties.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/properties/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex gap-3 rounded-xl bg-white p-2 ring-1 ring-black/10 transition-colors hover:bg-cream/50"
                        >
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-black/5">
                            {p.image && (
                              <Image src={p.image} alt={p.title} fill sizes="56px" className="object-cover" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-sm font-semibold text-ink">{formatINR(p.price)}</p>
                            <p className="line-clamp-1 text-xs text-ink/70">{p.title}</p>
                            <p className="text-xs capitalize text-ink/40">
                              {p.bhk ? `${p.bhk} BHK · ` : ''}
                              {p.localitySlug.replace(/-/g, ' ')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-cream px-3.5 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-ink/40" />
                </div>
              </div>
            )}
          </div>

          {/* Contact capture fields */}
          {needContact && (
            <div className="grid grid-cols-2 gap-2 border-t border-black/5 bg-cream/40 px-4 py-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-gold"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                aria-label="Phone number"
                className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
          )}

          {/* Composer */}
          <div className="flex items-center gap-2 border-t border-black/5 px-3 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={needContact ? 'Add a message (optional)…' : 'Ask me anything…'}
              aria-label="Message the concierge"
              className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || (!input.trim() && !(needContact && name.trim() && phone.trim()))}
              aria-label="Send message"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-colors hover:bg-ink/90 disabled:opacity-40"
            >
              <Send className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
