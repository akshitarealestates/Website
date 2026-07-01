import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, MapPin } from 'lucide-react';
import { Container } from '@/components/ui-kit/container';
import { Reveal } from '@/components/ui-kit/reveal';
import { imageFor } from '@/lib/data/images';

const CHECKLIST = [
  'Tenant sourcing & background checks',
  'Rent collection & legal rent deeds',
  'Maintenance coordination & inspections',
  'RERA & legal compliance support',
];

/**
 * Large rounded image with a floating white info card overlapping it — title,
 * copy, checklist and a pill CTA. Asymmetric and layered, not a flat box.
 */
export function PropertyManagement() {
  return (
    <section className="bg-cream py-24 md:py-28">
      <Container>
        <Reveal>
          <div className="relative">
            {/* Large image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2.25rem] shadow-[0_30px_70px_-30px_rgba(43,33,24,0.5)] md:aspect-[16/8]">
              <Image
                src={imageFor('management', 5)}
                alt="Akshita Real Estate property management"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/15 to-transparent" />

              {/* Floating location-style pill, top-left */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-cream-warm/90 px-4 py-2 text-xs font-medium text-ink shadow-lg backdrop-blur">
                <MapPin className="h-3.5 w-3.5 text-gold-deep" />
                Lucknow, UP
              </div>
            </div>

            {/* Floating white info card overlapping the image */}
            <div className="relative z-10 mx-auto -mt-24 w-[92%] rounded-[2rem] border border-black/5 bg-surface p-7 shadow-[0_28px_64px_-24px_rgba(43,33,24,0.35)] sm:p-9 md:absolute md:bottom-8 md:right-8 md:mx-0 md:mt-0 md:w-[28rem]">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold">
                Our services
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">
                Property <em className="font-normal italic text-gold-deep">management</em>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-sand-muted">
                Let us handle everything — from tenant screening and rent
                collection to maintenance and legal compliance. We protect your
                investment so you can focus on what matters.
              </p>

              <ul className="mt-5 space-y-2.5">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/services"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-all hover:bg-ink/90"
              >
                Learn more
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
