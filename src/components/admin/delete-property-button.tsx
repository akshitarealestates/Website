'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deletePropertyAction } from '@/app/admin/properties/actions';

export function DeletePropertyButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(() => {
      void deletePropertyAction(slug);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Delete ${title}`}
      className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="size-3.5" />
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
