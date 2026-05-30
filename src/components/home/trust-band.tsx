import { ShieldCheck, BadgeCheck, Award, Users } from 'lucide-react';
import { Container } from '@/components/ui-kit/container';
import { Reveal } from '@/components/ui-kit/reveal';

const SIGNALS = [
  { icon: ShieldCheck, value: 'RERA', label: 'Registered & compliant' },
  { icon: BadgeCheck, value: '100%', label: 'Verified listings' },
  { icon: Award, value: '12+ yrs', label: 'Serving Lucknow' },
  { icon: Users, value: '1,000+', label: 'Happy families' },
];

export function TrustBand() {
  return (
    <section className="border-y border-ink/10 bg-cream-warm">
      <Container>
        <Reveal>
          <ul className="grid grid-cols-2 divide-ink/10 md:grid-cols-4 md:divide-x">
            {SIGNALS.map(({ icon: Icon, value, label }) => (
              <li
                key={label}
                className="flex items-center gap-3.5 px-2 py-7 md:justify-center md:px-6"
              >
                <Icon className="h-7 w-7 shrink-0 text-gold-deep" strokeWidth={1.5} />
                <div>
                  <p className="font-display text-lg font-semibold leading-tight text-ink">
                    {value}
                  </p>
                  <p className="text-xs leading-tight text-ink/55">{label}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
