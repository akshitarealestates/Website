'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

// Business WhatsApp number in international format (no '+', no spaces).
const WHATSAPP_NUMBER = '916386111891';

// Quick-start intents — tapping one pre-fills the message.
const INTENTS: { label: string; message: string }[] = [
  { label: 'Property enquiry', message: "Hi Akshita Real Estate, I'd like to enquire about a property." },
  { label: 'Book a site visit', message: 'Hi Akshita Real Estate, I’d like to book a site visit.' },
  { label: 'Sell / list my property', message: 'Hi Akshita Real Estate, I want to list my property for sale.' },
  { label: 'Get a valuation', message: 'Hi Akshita Real Estate, I’d like a valuation for my property.' },
];

/** WhatsApp glyph (lucide has no brand icon). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function ConciergeWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // Hidden on admin routes (mounted site-wide via the root layout).
  if (pathname?.startsWith('/admin')) return null;

  function openWhatsApp() {
    const trimmed = message.trim();
    const body = trimmed || 'Hi Akshita Real Estate, I’d like some help.';
    const greeting = name.trim() ? `Hi Akshita Real Estate, this is ${name.trim()}.\n` : '';
    const text = name.trim() && trimmed ? `${greeting}${trimmed}` : body;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#128C7E]"
      >
        {open ? <X className="size-6" aria-hidden /> : <WhatsAppIcon className="size-7" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Akshita Real Estate on WhatsApp"
          className="fixed bottom-24 right-5 z-50 flex max-h-[80vh] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
              <WhatsAppIcon className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold">Akshita Real Estate</p>
              <p className="text-xs text-white/70">Typically replies within minutes</p>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#ECE5DD] px-4 py-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm">
              Hi there! 👋 Tell us what you’re looking for and we’ll continue the
              conversation on WhatsApp.
            </div>

            {/* Quick intents */}
            <div className="flex flex-wrap gap-2">
              {INTENTS.map((intent) => (
                <button
                  key={intent.label}
                  type="button"
                  onClick={() => setMessage(intent.message)}
                  className="rounded-full border border-[#075E54]/20 bg-white px-3 py-1.5 text-xs font-medium text-[#075E54] transition-colors hover:bg-[#075E54] hover:text-white"
                >
                  {intent.label}
                </button>
              ))}
            </div>
          </div>

          {/* Request input */}
          <div className="space-y-2.5 border-t border-black/5 bg-white px-4 py-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              aria-label="Your name"
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[#25D366]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              aria-label="Your message"
              rows={2}
              className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[#25D366]"
            />
            <button
              type="button"
              onClick={openWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1EBE5D]"
            >
              <WhatsAppIcon className="size-4" />
              Start chat on WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
}
