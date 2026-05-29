'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Locality } from '@/lib/data/types';

interface SearchBarProps {
  localities: Locality[];
}

const PRICE_OPTIONS = [
  { label: 'Any Price', value: '' },
  { label: 'Under ₹50L', value: 'max:5000000' },
  { label: '₹50L – 1Cr', value: 'min:5000000:max:10000000' },
  { label: '₹1Cr – 3Cr', value: 'min:10000000:max:30000000' },
  { label: '₹3Cr+', value: 'min:30000000' },
];

const ROOM_OPTIONS = [
  { label: 'Any Rooms', value: '' },
  { label: '1 BHK', value: '1' },
  { label: '2 BHK', value: '2' },
  { label: '3 BHK', value: '3' },
  { label: '4+ BHK', value: '4' },
];

const TYPE_OPTIONS = [
  { label: 'Any Type', value: '' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Resell', value: 'resell' },
  { label: 'Premium Project', value: 'premium_project' },
];

export function SearchBar({ localities }: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [rooms, setRooms] = useState('');
  const [type, setType] = useState('');

  function handleSearch() {
    const params = new URLSearchParams();
    if (location) params.set('localitySlug', location);
    if (rooms) params.set('bhk', rooms);
    if (type) params.set('category', type);

    // Parse price
    if (price) {
      const parts = price.split(':');
      for (let i = 0; i < parts.length; i += 2) {
        if (parts[i] === 'min') params.set('minPrice', parts[i + 1]);
        if (parts[i] === 'max') params.set('maxPrice', parts[i + 1]);
      }
    }

    router.push('/properties?' + params.toString());
  }

  const selectClass =
    'flex-1 min-w-[120px] bg-transparent text-sm text-ink/80 outline-none cursor-pointer py-2 px-3 appearance-none';

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-2xl shadow-lg overflow-hidden divide-y md:divide-y-0 md:divide-x divide-black/5">
      {/* Location */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className={selectClass}
        aria-label="Select location"
      >
        <option value="">All Locations</option>
        {localities.map((loc) => (
          <option key={loc.slug} value={loc.slug}>
            {loc.name}
          </option>
        ))}
      </select>

      {/* Price */}
      <select
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className={selectClass}
        aria-label="Select price range"
      >
        {PRICE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Rooms */}
      <select
        value={rooms}
        onChange={(e) => setRooms(e.target.value)}
        className={selectClass}
        aria-label="Select number of rooms"
      >
        {ROOM_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Type */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={selectClass}
        aria-label="Select property type"
      >
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="bg-ink text-white text-sm font-medium px-8 py-3 hover:bg-ink/90 transition-colors shrink-0"
        aria-label="Search properties"
      >
        Search
      </button>
    </div>
  );
}
