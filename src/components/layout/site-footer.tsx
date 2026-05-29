import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-4 text-white/80">
        <div>
          <p className="font-display text-lg text-white">Akshita Realty</p>
          <p className="mt-2 text-sm">Premium real estate in Lucknow.</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-white">Explore</p>
          <ul className="space-y-2">
            <li><Link href="/properties?category=commercial">Commercial</Link></li>
            <li><Link href="/properties?category=resell">Resell</Link></li>
            <li><Link href="/properties?category=premium_project">Premium Projects</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-white">Company</p>
          <ul className="space-y-2">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/insights">Insights</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-white">Sell with us</p>
          <ul className="space-y-2"><li><Link href="/sell">List your property</Link></li></ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Akshita Realty. All rights reserved.
      </div>
    </footer>
  );
}
