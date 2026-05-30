import { Star } from 'lucide-react';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { Reveal } from '@/components/ui-kit/reveal';
import { testimonials } from '@/lib/data/mock/testimonials';

export function Testimonials() {
  return (
    <section className="bg-charcoal py-24 text-white">
      <Container>
        <Reveal>
          <SectionHeading
            overline="In their words"
            title="What our clients say"
            italicWord="clients"
            className="mb-14 [&_h2]:text-white [&_p]:text-white/50"
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 2) * 0.08}>
              <figure className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-500 hover:border-gold/30 hover:bg-white/[0.05]">
                {/* Opening quote mark */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-4 left-6 select-none font-display text-[7rem] leading-none text-gold/15"
                >
                  &ldquo;
                </span>

                <div className="relative">
                  <div className="mb-5 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>

                  <blockquote className="font-display text-lg font-normal leading-relaxed text-white/90 md:text-xl">
                    {t.quote}
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-sm font-semibold text-gold">
                      {t.name.charAt(0)}
                    </span>
                    <span className="text-sm">
                      <span className="block font-medium text-white">{t.name}</span>
                      <span className="block text-white/50">
                        {t.role} · {t.locality}
                      </span>
                    </span>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
