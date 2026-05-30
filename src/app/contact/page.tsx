import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';
import { ContactForm } from './contact-form';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Akshita Realty',
  description: 'Get in touch with Akshita Realty. Speak with a specialist about buying, selling, or renting property in Lucknow.',
};

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Office',
    value: '14 Vibhuti Khand, Gomti Nagar, Lucknow — 226010',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 99999 12345',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'Pratap.vijendrsingh96@gmail.com',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon – Sat: 9:00 AM – 7:00 PM',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero band */}
      <section className="bg-ink text-white py-20">
        <Container>
          <p className="text-xs uppercase tracking-[0.2em] text-sky mb-4">We&apos;re here</p>
          <h1 className="font-display text-5xl font-semibold leading-tight md:text-7xl max-w-2xl">
            Let&apos;s find your <em className="italic font-normal">perfect property</em>
          </h1>
          <p className="mt-5 text-white/60 max-w-lg">
            Drop us a message and a specialist will call you back — usually within a few hours on business days.
          </p>
        </Container>
      </section>

      {/* Main content */}
      <section className="py-24 bg-cream">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] items-start">
            {/* Left: contact info */}
            <div>
              <SectionHeading
                overline="Get in touch"
                title="Contact information"
                italicWord="information"
                className="mb-10"
              />

              <div className="space-y-6">
                {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-ink/5 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-ink/50" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-ink/40 mb-0.5">{label}</p>
                      <p className="text-sm text-ink font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Localities */}
              <div className="mt-12 rounded-2xl bg-white border border-black/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/40 mb-4">Localities we serve</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Gomti Nagar',
                    'Hazratganj',
                    'Sushant Golf City',
                    'Indira Nagar',
                    'Vibhuti Khand',
                    'Mahanagar',
                    'Aliganj',
                    'Jankipuram',
                  ].map((loc) => (
                    <span
                      key={loc}
                      className="rounded-full bg-cream px-3 py-1 text-xs text-ink/60"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-8 md:p-10">
              <h2 className="font-display text-2xl font-semibold text-ink mb-1">
                Send us a message
              </h2>
              <p className="text-sm text-ink/50 mb-8">
                Tell us what you need and we&apos;ll be in touch shortly.
              </p>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
