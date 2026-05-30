'use client';

import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Property, ProjectConfiguration } from '@/lib/data/types';
import { formatINR, formatArea } from '@/lib/format';
import { EnquiryForm } from './enquiry-form';
import { FavoriteButton } from './favorite-button';

const WHATSAPP_NUMBER = '919999999999';

const AVAILABILITY: Record<
  NonNullable<ProjectConfiguration['availability']>,
  { label: string; cls: string }
> = {
  available: { label: 'Available', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15' },
  few_left: { label: 'Few left', cls: 'bg-amber-50 text-amber-700 ring-amber-600/15' },
  sold_out: { label: 'Sold out', cls: 'bg-black/5 text-ink/45 ring-black/10' },
};

function priceRange(c: ProjectConfiguration): string {
  if (c.priceTo && c.priceTo > c.price) {
    return `${formatINR(c.price)} – ${formatINR(c.priceTo)}`;
  }
  return formatINR(c.price);
}

function sizeText(c: ProjectConfiguration): string {
  return c.sizeLabel ?? formatArea(c.sizeSqft);
}

/**
 * Client experience that couples the configurations table with the enquiry
 * panel: choosing "Enquire" on a row prefills the enquiry message with that
 * configuration and scrolls the form into view.
 */
export function ProjectEnquiryExperience({ property }: { property: Property }) {
  const configs = property.project?.configurations ?? [];
  const baseMessage = `I'm interested in ${property.title}. Please share more details.`;
  const [message, setMessage] = useState(baseMessage);
  const enquiryRef = useRef<HTMLDivElement>(null);

  function enquireAbout(c: ProjectConfiguration) {
    setMessage(
      `I'm interested in the ${c.type} (${sizeText(c)}) at ${property.title}. Please share pricing, payment plan and availability.`,
    );
    enquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I'm interested in ${property.title} (${property.slug})`,
  )}`;

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      {/* Configurations & pricing */}
      <section className="lg:col-span-2">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Configurations &amp; pricing
        </h2>
        <p className="mt-2 text-sm text-sand-muted">
          Choose a home type to enquire about pricing and availability.
        </p>

        {configs.length > 0 ? (
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-black/5 bg-surface shadow-[0_18px_48px_-30px_rgba(43,33,24,0.4)]">
            <div className="divide-y divide-black/5">
              {configs.map((c) => {
                const avail = c.availability ? AVAILABILITY[c.availability] : null;
                const soldOut = c.availability === 'sold_out';
                return (
                  <div
                    key={`${c.type}-${c.sizeSqft}`}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-display text-lg font-semibold text-ink">{c.type}</h3>
                        {avail && (
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${avail.cls}`}
                          >
                            {avail.label}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-sand-muted">{sizeText(c)}</p>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-sand-muted">
                          Price range
                        </p>
                        <p className="font-display text-base font-semibold text-ink">
                          {priceRange(c)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => enquireAbout(c)}
                        disabled={soldOut}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Enquire
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-sand-muted">
            Configuration details will be announced soon.
          </p>
        )}
      </section>

      {/* Enquiry panel */}
      <aside className="lg:col-span-1">
        <div ref={enquiryRef} className="space-y-4 lg:sticky lg:top-8">
          <div className="rounded-[2rem] border border-black/5 bg-surface p-7 shadow-[0_24px_60px_-30px_rgba(43,33,24,0.45)]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold-deep">
              Enquire now
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink">
              Interested in this project?
            </h2>
            <p className="mt-1.5 text-sm text-sand-muted">
              Share your details and our team will get back to you.
            </p>
            <div className="mt-5">
              <EnquiryForm slug={property.slug} title={property.title} message={message} />
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <span aria-hidden>💬</span>
              Chat on WhatsApp
            </a>

            <div className="mt-3">
              <FavoriteButton slug={property.slug} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
