'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { PropertyImage } from '@/lib/data/types';

export function Gallery({ images }: { images: PropertyImage[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  const main = images[active] ?? images[0];

  return (
    <div className="space-y-4">
      {/* Main cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-cream">
        <Image
          src={main.url}
          alt={main.alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl transition-all ${
                i === active
                  ? 'ring-2 ring-ink ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 16vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
