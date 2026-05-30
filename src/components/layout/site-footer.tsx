import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon, XIcon } from '@/components/icons/social';

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'All properties', href: '/properties' },
      { label: 'Commercial', href: '/properties?category=commercial' },
      { label: 'Resell', href: '/properties?category=resell' },
      { label: 'Premium Projects', href: '/properties?category=premium_project' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Insights', href: '/insights' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Sell with us',
    links: [
      { label: 'List your property', href: '/sell' },
      { label: 'Property valuation', href: '/valuation' },
      { label: 'AI Investment Planner', href: '/investment-planner' },
    ],
  },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: LinkedinIcon },
  { label: 'X', href: 'https://x.com', icon: XIcon },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <p className="font-display text-2xl font-semibold text-white">Akshita Realty</p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Premium real estate in Lucknow — handpicked homes, verified listings, and a
              personal touch through every step of your property journey.
            </p>

            <form
              className="mt-7"
              aria-label="Newsletter signup"
            >
              <label htmlFor="footer-email" className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                Market insights, monthly
              </label>
              <div className="flex items-center overflow-hidden rounded-full border border-white/15 bg-white/5 focus-within:border-gold/60">
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="m-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition-colors hover:bg-gold-deep"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Link columns + contact */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="text-sm">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-white/45">{col.heading}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/70 transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact */}
            <div className="text-sm">
              <p className="mb-4 text-xs uppercase tracking-[0.18em] text-white/45">Get in touch</p>
              <ul className="space-y-3 text-white/70">
                <li>
                  <a href="tel:+915221234567" className="flex items-start gap-2.5 transition-colors hover:text-gold">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                    +91 522 123 4567
                  </a>
                </li>
                <li>
                  <a href="mailto:Pratap.vijendrsingh96@gmail.com" className="flex items-start gap-2.5 transition-colors hover:text-gold">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                    Pratap.vijendrsingh96@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                  Gomti Nagar, Lucknow, UP 226010
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-12 flex gap-3">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Akshita Realty. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white/80">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white/80">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
