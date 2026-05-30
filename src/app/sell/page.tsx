import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { listLocalities } from '@/lib/data/repo';
import { SellWizard } from '@/components/sell/sell-wizard';
import { submitListing } from './actions';

export default async function SellPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const localities = listLocalities().map((l) => ({ slug: l.slug, name: l.name }));

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <header className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-gold">Sell with us</p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          List your property for resale
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink/60">
          Tell us about your home in a few quick steps. Our team reviews every listing
          before it goes live, so buyers only see verified, premium homes.
        </p>
      </header>

      <div className="mt-10">
        <SellWizard localities={localities} action={submitListing} />
      </div>
    </section>
  );
}
