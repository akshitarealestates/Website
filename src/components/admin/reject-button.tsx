'use client';

import { useRef, useState, useTransition } from 'react';
import { XCircle, ChevronDown } from 'lucide-react';
import { rejectAction } from '@/app/admin/moderation/actions';

export function RejectButton({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const reason = inputRef.current?.value.trim() ?? '';
    if (!reason) {
      inputRef.current?.focus();
      return;
    }
    const fd = new FormData();
    fd.set('reason', reason);
    startTransition(() => {
      void rejectAction(slug, fd).then(() => setOpen(false));
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        <XCircle className="size-3.5" />
        Reject
        <ChevronDown className="size-3" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        ref={inputRef}
        name="reason"
        type="text"
        required
        placeholder="Reason for rejection…"
        autoFocus
        className="w-full rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-red-300"
      />
      <div className="flex gap-1.5">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? 'Rejecting…' : 'Confirm reject'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-ink/60 hover:bg-black/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
