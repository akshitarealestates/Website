'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { SmartSearch } from '@/components/ai/smart-search';
import { IMAGE_POOL } from '@/lib/data/images';

interface HeroProps {
  localities: { name: string; slug: string }[];
}

// 5 distinct luxury architecture / interior frames from the verified pool.
const HERO_IMAGES = [
  IMAGE_POOL[0], // photo-1600596542815 — modern home exterior
  IMAGE_POOL[7], // photo-1613490493576 — premium residential
  IMAGE_POOL[2], // photo-1512917774080 — refined interior
  IMAGE_POOL[12], // photo-1560448204 — luxury living space
  IMAGE_POOL[5], // photo-1564013799919 — contemporary architecture
];

const QUICK_CHIPS = [
  '3 BHK in Gomti Nagar',
  'Office space',
  'Under ₹1 Cr',
  'New projects',
];

const ROTATE_MS = 5000;

export function Hero({ localities }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % HERO_IMAGES.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-charcoal">
      {/* Rotating background — crossfade with subtle Ken-Burns zoom */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute inset-0"
              initial={reduceMotion ? false : { scale: 1.08 }}
              animate={reduceMotion ? undefined : { scale: 1 }}
              transition={{ duration: ROTATE_MS / 1000 + 1.4, ease: 'linear' }}
            >
              <Image
                src={HERO_IMAGES[index]}
                alt=""
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Refined dark gradient — stronger at the bottom for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/30 to-ink/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-transparent" />

      {/* Content — bottom-left, generous */}
      <div className="relative z-10 w-full pb-20 pt-40">
        <div className="mx-auto w-full max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <p className="mb-5 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-gold">
              Lucknow · Premium Real Estate
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] text-white text-balance md:text-7xl">
              Redefining
              <br />
              <em className="font-light italic text-cream">modern living</em>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Curated commercial spaces, resale homes, and premium projects across
              Lucknow — each one verified, priced fairly, and matched to your life.
            </p>
          </motion.div>

          {/* Unified elegant search */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="mt-10 max-w-2xl"
          >
            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-2 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md">
              <SmartSearch localities={localities} />
            </div>

            {/* Quick chips + advanced link */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {QUICK_CHIPS.map((chip) => (
                <Link
                  key={chip}
                  href={`/properties?query=${encodeURIComponent(chip)}`}
                  className="rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/85 transition-all duration-300 hover:border-gold/60 hover:bg-white/15 hover:text-white"
                >
                  {chip}
                </Link>
              ))}
              <Link
                href="/properties"
                className="ml-1 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-gold"
              >
                Advanced filters
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute inset-x-0 bottom-6 z-10 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-white/50"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
