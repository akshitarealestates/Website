'use client';

import { useTransition } from 'react';
import { setLeadStatusAction } from '@/app/admin/leads/actions';
import type { Lead } from '@/lib/data/types';

interface Props {
  id: string;
  currentStatus: Lead['status'];
}

export function LeadStatusControls({ id, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  function move(status: Lead['status']) {
    startTransition(() => {
      void setLeadStatusAction(id, status);
    });
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {currentStatus !== 'contacted' && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => move('contacted')}
          className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
        >
          Mark contacted
        </button>
      )}
      {currentStatus !== 'closed' && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => move('closed')}
          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
        >
          Mark closed
        </button>
      )}
      {currentStatus !== 'new' && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => move('new')}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
        >
          Reopen
        </button>
      )}
    </div>
  );
}
