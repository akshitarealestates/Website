import Link from 'next/link';
import { Star } from 'lucide-react';
import {
  listAllProperties,
  listPendingProperties,
  listLeads,
  listFeatured,
} from '@/lib/data/repo';
import { formatINR } from '@/lib/format';
import { StatusBadge } from '@/components/admin/status-badge';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const SOURCE_LABELS: Record<string, string> = {
  enquiry_form: 'Enquiry form',
  chatbot: 'Chatbot',
  valuation: 'Valuation',
  whatsapp: 'WhatsApp',
  contact: 'Contact',
};

export default function AdminDashboard() {
  const allProperties = listAllProperties({});
  const published = allProperties.filter((p) => p.status === 'published');
  const pending = listPendingProperties();
  const leads = listLeads();
  const newLeads = leads.filter((l) => l.status === 'new');
  const featured = listFeatured();

  const recentLeads = leads.slice(0, 5);
  const recentListings = [...allProperties]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const kpis = [
    { label: 'Published', value: published.length, href: '/admin/properties?status=published' },
    { label: 'Pending moderation', value: pending.length, href: '/admin/moderation' },
    { label: 'Total leads', value: leads.length, href: '/admin/leads' },
    { label: 'New leads', value: newLeads.length, href: '/admin/leads' },
    { label: 'Featured', value: featured.length, href: '/admin/properties' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">
          Overview of listings, moderation queue, and incoming leads.
        </p>
      </header>

      {/* ── KPI cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="group rounded-xl bg-white p-5 ring-1 ring-black/5 transition-shadow hover:shadow-md"
          >
            <p className="text-3xl font-semibold text-ink">{kpi.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink/50 group-hover:text-ink/70">
              {kpi.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Recent leads ─────────────────────────────────────────── */}
        <section className="rounded-xl bg-white ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">Recent leads</h2>
            <Link href="/admin/leads" className="text-xs font-medium text-gold hover:underline">
              View all
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink/50">No leads yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-ink/40">
                    <th className="px-5 py-2 font-medium">Name</th>
                    <th className="px-5 py-2 font-medium">Phone</th>
                    <th className="px-5 py-2 font-medium">Source</th>
                    <th className="px-5 py-2 font-medium">Status</th>
                    <th className="px-5 py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-5 py-3 font-medium text-ink">{lead.name}</td>
                      <td className="px-5 py-3 text-ink/70">{lead.phone}</td>
                      <td className="px-5 py-3 text-ink/70">
                        {SOURCE_LABELS[lead.sourceChannel] ?? lead.sourceChannel}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={lead.status} kind="lead" />
                      </td>
                      <td className="px-5 py-3 text-ink/60">{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Recent listings ──────────────────────────────────────── */}
        <section className="rounded-xl bg-white ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">Recent listings</h2>
            <Link href="/admin/properties" className="text-xs font-medium text-gold hover:underline">
              View all
            </Link>
          </div>
          {recentListings.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink/50">No listings yet.</p>
          ) : (
            <ul className="divide-y divide-black/5">
              {recentListings.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/properties/${p.slug}/edit`}
                      className="flex items-center gap-1.5 truncate font-medium text-ink hover:text-gold"
                    >
                      {p.isFeatured && (
                        <Star className="size-3.5 shrink-0 fill-gold text-gold" aria-label="Featured" />
                      )}
                      <span className="truncate">{p.title}</span>
                    </Link>
                    <p className="text-xs text-ink/50">{formatINR(p.price)}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
