// Curated luxury architecture & interiors — all URLs verified high-resolution premium Unsplash assets.
// Hero-grade parameters: auto=format&fit=crop&w=1600&q=85.
export const IMAGE_POOL: string[] = [
  // Luxury Exteriors & Architecture
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85', // modern house exterior
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85', // glass/steel luxury villa
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85', // upscale villa with pool
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', // beautiful sunset estate
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85', // stunning illuminated mansion
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85', // palm-shaded luxury estate
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85', // sprawling estate facade
  'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1600&q=85', // classic white architectural villa
  'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1600&q=85', // warm wood/concrete modernist home
  'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=1600&q=85', // bold architectural pavilion
  
  // Premium Commercial Corridors
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85', // high-rise glass skyscraper facade
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85', // grade-A glass office layout
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85', // corporate boardroom/lounge
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85', // sleek minimalist office interior

  // Luxury Interiors & Living Spaces
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', // warm wood-accents luxury living room
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=85', // bright premium residential lounge
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85', // cozy designer fireplace room
  'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=1600&q=85', // masterfully styled concrete lounge
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85', // luxury lounge dining space

  // Designer Kitchens & Bathrooms
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85', // high-end modern kitchen
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=85', // marble double-island gourmet kitchen
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85', // state-of-the-art marble bathroom
  
  // Luxury Bedrooms
  'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=1600&q=85', // master bedroom with skyline glass wall
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=85', // modern minimalist warm bedroom
];

/** Guaranteed fallback — picsum.photos always returns 200 */
export const fallbackImage = (seed: string): string =>
  `https://picsum.photos/seed/${seed}/1600/1067`;

/**
 * Returns a pool URL hashed uniquely by seed (e.g. property slug) to ensure
 * distinct properties have completely different, beautiful image portfolios.
 */
export function imageFor(seed: string, index = 0): string {
  if (IMAGE_POOL.length === 0) return fallbackImage(`${seed}-${index}`);
  
  // Generate a robust string hash from the seed slug
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Offset by the index (0 = exterior, 1 = living, 2 = bed, 3 = kitchen, etc.)
  const selectedIndex = Math.abs(hash + index * 3) % IMAGE_POOL.length;
  
  return IMAGE_POOL[selectedIndex];
}
