import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui-kit/container';
import { Reveal } from '@/components/ui-kit/reveal';
import { imageFor } from '@/lib/data/images';

/**
 * Editorial about strip: the statement paired with an overlapping image
 * collage and a floating "12+ years" stat card overlapping a corner.
 */
export function AboutCollage() {
  return (
    <section className="bg-cream py-24 md:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Statement */}
          <Reveal>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-gold">
              Akshita Realty
            </p>
            <p className="max-w-xl text-pretty font-display text-[1.7rem] font-semibold leading-[1.25] text-ink md:text-[2.35rem]">
              We handle every kind of property transaction across Lucknow, giving
              each client a{' '}
              <em className="font-normal italic text-gold-deep">seamless</em> and{' '}
              <em className="font-normal italic text-gold-deep">personalised</em>{' '}
              experience.
            </p>
            <div className="mt-9 flex flex-wrap gap-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-gold"
              >
                Our story <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink/55 transition-colors hover:text-ink"
              >
                Get in touch <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          {/* Overlapping image collage */}
          <Reveal delay={0.08}>
            <div className="relative mx-auto aspect-square w-full max-w-[30rem] lg:mx-0">
              {/* Large back image */}
              <div className="absolute right-0 top-0 h-[72%] w-[72%] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-24px_rgba(43,33,24,0.45)]">
                <Image
                  src={imageFor('about-a', 0)}
                  alt="Contemporary architecture in Lucknow"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 60vw, 22vw"
                />
              </div>

              {/* Overlapping front image */}
              <div className="absolute bottom-0 left-0 h-[58%] w-[56%] overflow-hidden rounded-[1.75rem] border-[5px] border-cream shadow-[0_28px_64px_-22px_rgba(43,33,24,0.5)]">
                <Image
                  src={imageFor('about-b', 8)}
                  alt="Refined interior styling"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 18vw"
                />
              </div>

              {/* Small accent image */}
              <div className="absolute right-[6%] bottom-[4%] hidden h-[34%] w-[30%] overflow-hidden rounded-[1.25rem] border-[5px] border-cream shadow-[0_18px_44px_-18px_rgba(43,33,24,0.45)] sm:block">
                <Image
                  src={imageFor('about-c', 14)}
                  alt="A welcoming home exterior"
                  fill
                  className="object-cover"
                  sizes="10vw"
                />
              </div>

              {/* Floating stat pill card */}
              <div className="absolute left-[2%] top-[6%] rounded-2xl bg-ink px-5 py-4 text-cream shadow-[0_20px_48px_-18px_rgba(43,33,24,0.6)]">
                <p className="font-display text-3xl font-semibold leading-none text-gold">
                  12+
                </p>
                <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-cream/70">
                  Years of trust
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
