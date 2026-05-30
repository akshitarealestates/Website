'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'akshita:favorites';

function readFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function FavoriteButton({ slug }: { slug: string }) {
  const [favorited, setFavorited] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavorited(readFavorites().includes(slug));
  }, [slug]);

  function toggle() {
    const current = readFavorites();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
    setFavorited(next.includes(slug));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={mounted ? favorited : undefined}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/30"
    >
      <span aria-hidden className={favorited ? 'text-gold' : 'text-ink/40'}>
        {favorited ? '♥' : '♡'}
      </span>
      {favorited ? 'Saved to favorites' : 'Save to favorites'}
    </button>
  );
}
