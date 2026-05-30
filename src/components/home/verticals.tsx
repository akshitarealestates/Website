import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { Reveal } from '@/components/ui-kit/reveal';
import { IconButton } from '@/components/ui-kit/icon-button';

interface Vertical {
  href: string;
  label: string;
  blurb: string;
  imageUrl: string;
  imageAlt: string;
}

/**
 * Asymmetric editorial verticals: tall rounded-3xl image tiles, each with a
 * floating glass label card + circular arrow button at the bottom. The first
 * tile spans wider on large screens for rhythm.
 */
export function Verticals({ verticals }: { verticals: Vertical[] }) {
  return (
    <section className="bg-surface py-24 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            overline="What we offer"
            title="Find your fit"
            italicWord="fit"
            className="mb-12"
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          {verticals.map((v, i) => (
            <Reveal
              key={v.href}
              delay={i * 0.08}
              className={
                i === 0
                  ? 'md:col-span-2 lg:col-span-6'
                  : 'lg:col-span-3'
              }
            >
              <Link
                href={v.href}
                className="group relative block h-full min-h-[26rem] overflow-hidden rounded-[2rem] bg-ink lg:min-h-[32rem]"
              >
                <Image
                  src={v.imageUrl}
                  alt={v.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.06]"
                  sizes={i === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 100vw, 25vw'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

                {/* Floating glass label card */}
                <div className="absolute inset-x-4 bottom-4">
                  <div className="flex items-center gap-4 rounded-[1.4rem] border border-white/15 bg-cream-warm/85 p-4 shadow-[0_16px_40px_-18px_rgba(43,33,24,0.6)] backdrop-blur-md">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xl font-semibold text-ink">
                        {v.label}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-sand-muted">
                        {v.blurb}
                      </p>
                    </div>
                    <IconButton
                      variant="espresso"
                      size="lg"
                      className="transition-transform duration-300 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
