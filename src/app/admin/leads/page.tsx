import Link from 'next/link';
import { Phone, Mail, MessageSquare, Users } from 'lucide-react';
import { listLeads } from '@/lib/data/repo';
import { StatusBadge } from '@/components/admin/status-badge';
import { LeadStatusControls } from '@/components/admin/lead-status-controls';
import type { Lead } from '@/lib/data/types';

const fmt = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' });

const SOURCE_LABELS: Record<Lead['sourceChannel'], string> = {
  enquiry_form: 'Enquiry Form',
  chatbot: 'Chatbot',
  valuation: 'Valuation',
  whatsapp: 'WhatsApp',
  contact: 'Contact',
};

const SOURCE_STYLES: Record<Lead['sourceChannel'], string> = {
  enquiry_form: 'bg-sky-100 text-sky-700 ring-sky-600/20',
  chatbot: 'bg-purple-100 text-purple-700 ring-purple-600/20',
  valuation: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  whatsapp: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
  contact: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

const COLUMNS: { status: Lead['status']; label: string; accent: string }[] = [
  { status: 'new', label: 'New', accent: 'border-t-emerald-500' },
  { status: 'contacted', label: 'Contacted', accent: 'border-t-amber-500' },
  { status: 'closed', label: 'Closed', accent: 'border-t-slate-400' },
];

function waLink(lead: Lead): string {
  const name = encodeURIComponent(lead.name);
  const prop = lead.propertySlug
    ? encodeURIComponent(` re: ${lead.propertySlug.replace(/-/g, ' ')}`)
    : '';
  const phone = lead.phone.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=Hi+${name}${prop}`;
}

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-3">
      {/* Top: name + source + date */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{lead.name}</p>
          <p className="text-xs text-ink/40">{fmt.format(new Date(lead.createdAt))}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${SOURCE_STYLES[lead.sourceChannel]}`}
        >
          {SOURCE_LABELS[lead.sourceChannel]}
        </span>
      </div>

      {/* Contact links */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
        <a
          href={`tel:${lead.phone}`}
          className="inline-flex items-center gap-1 text-ink/70 hover:text-ink"
        >
          <Phone className="size-3" aria-hidden />
          {lead.phone}
        </a>
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="inline-flex items-center gap-1 text-ink/70 hover:text-ink"
          >
            <Mail className="size-3" aria-hidden />
            {lead.email}
          </a>
        )}
      </div>

      {/* Property link */}
      {lead.propertySlug && (
        <Link
          href={`/properties/${lead.propertySlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-1 text-xs font-medium text-gold hover:underline"
        >
          {lead.propertySlug.replace(/-/g, ' ')}
        </Link>
      )}

      {/* Message snippet */}
      {lead.message && (
        <p className="flex items-start gap-1 text-xs text-ink/50">
          <MessageSquare className="mt-0.5 size-3 shrink-0" aria-hidden />
          <span className="line-clamp-2">{lead.message}</span>
        </p>
      )}

      {/* Quick WhatsApp */}
      <a
        href={waLink(lead)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
      >
        <svg className="size-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>

      {/* Status controls */}
      <LeadStatusControls id={lead.id} currentStatus={lead.status} />
    </div>
  );
}

export default function LeadsPage() {
  const leads = listLeads();

  const counts = {
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    closed: leads.filter((l) => l.status === 'closed').length,
  };

  const grouped = {
    new: leads.filter((l) => l.status === 'new'),
    contacted: leads.filter((l) => l.status === 'contacted'),
    closed: leads.filter((l) => l.status === 'closed'),
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Leads Pipeline</h1>
        <p className="mt-1 text-sm text-ink/60">
          {leads.length === 0
            ? 'No leads yet.'
            : `${leads.length} total ${leads.length === 1 ? 'lead' : 'leads'}`}
        </p>
      </header>

      {/* ── KPI bar ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(({ status, label }) => (
          <div
            key={status}
            className="rounded-xl bg-white p-4 ring-1 ring-black/5 text-center"
          >
            <p className="font-display text-2xl font-semibold text-ink">
              {counts[status]}
            </p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-ink/50">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 ring-1 ring-black/5">
          <Users className="mb-4 size-12 text-ink/20" aria-hidden />
          <p className="text-base font-medium text-ink/60">No leads yet.</p>
          <p className="mt-1 text-sm text-ink/40">
            Leads from enquiry forms and chatbot will appear here.
          </p>
        </div>
      ) : (
        /* ── Kanban columns ───────────────────────────────────────── */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {COLUMNS.map(({ status, label, accent }) => (
            <section key={status}>
              <div
                className={`mb-3 overflow-hidden rounded-xl bg-white ring-1 ring-black/5 border-t-4 ${accent}`}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <h2 className="text-sm font-semibold text-ink">{label}</h2>
                  <StatusBadge status={status} kind="lead" />
                </div>
              </div>

              <div className="space-y-3">
                {grouped[status].length === 0 ? (
                  <p className="rounded-xl border border-dashed border-black/10 py-8 text-center text-xs text-ink/40">
                    No {label.toLowerCase()} leads
                  </p>
                ) : (
                  grouped[status].map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
