'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const STORAGE_KEY = 'akshita:favorites';

export interface FavoriteEntry {
  slug: string;
  title: string;
  price: string;
  locality: string;
  image: string;
}

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

export function FavoritesList({
  propertyMap,
}: {
  propertyMap: Record<string, FavoriteEntry>;
}) {
  const [mounted, setMounted] = useState(false);
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    setSlugs(readFavorites());
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-2xl bg-white py-12 text-center text-sm text-ink/40 ring-1 ring-black/5">
        Loading saved properties…
      </div>
    );
  }

  // Only keep favorites that still resolve to a published property.
  const entries = slugs
    .map((slug) => propertyMap[slug])
    .filter((e): e is FavoriteEntry => Boolean(e));

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center ring-1 ring-black/5">
        <p className="text-base font-medium text-ink/70">No saved properties yet.</p>
        <p className="mt-1 text-sm text-ink/40">
          Tap the heart on any listing to save it here.
        </p>
        <Link
          href="/properties"
          className="mt-5 inline-flex items-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-black/5"
        >
          Browse properties
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((e) => (
        <Link
          key={e.slug}
          href={`/properties/${e.slug}`}
          className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
            {e.image && (
              <Image
                src={e.image}
                alt={e.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <div className="p-4">
            <p className="font-display text-xl font-semibold text-ink">{e.price}</p>
            <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-ink">
              {e.title}
            </h3>
            <p className="mt-1 text-xs capitalize text-ink/50">{e.locality}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
