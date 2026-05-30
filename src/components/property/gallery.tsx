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
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] bg-cream shadow-[0_24px_60px_-32px_rgba(43,33,24,0.5)]">
        <Image
          src={main.url}
          alt={main.alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        {images.length > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-ink/75 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur">
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnail rail */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-2xl transition-all duration-300 ease-luxe ${
                i === active
                  ? 'ring-2 ring-gold ring-offset-2 ring-offset-white'
                  : 'opacity-65 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="112px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
