'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/session';
import { createProperty } from '@/lib/data/repo';
import type { Property, ListingType } from '@/lib/data/types';

export interface SellState {
  ok?: boolean;
  slug?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const LISTING_TYPES: ListingType[] = ['sale', 'rent'];

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

function num(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function csvList(fd: FormData, key: string): string[] {
  const v = str(fd, key);
  if (!v) return [];
  return v.split(',').map((s) => s.trim()).filter(Boolean);
}

function lineList(fd: FormData, key: string): string[] {
  const v = fd.get(key);
  if (typeof v !== 'string') return [];
  return v.split('\n').map((s) => s.trim()).filter(Boolean);
}

export async function submitListing(
  _prevState: SellState,
  formData: FormData,
): Promise<SellState> {
  // Never trust the client for ownership — read it server-side.
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be signed in to list a property.' };
  }

  const fieldErrors: Record<string, string> = {};

  const title = str(formData, 'title');
  if (!title) fieldErrors.title = 'Title is required.';

  const price = num(formData, 'price');
  if (price === null || price < 0) fieldErrors.price = 'Enter a valid price.';

  const localitySlug = str(formData, 'localitySlug');
  if (!localitySlug) fieldErrors.localitySlug = 'Select a locality.';

  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }

  const listingTypeRaw = str(formData, 'listingType');
  const listingType: ListingType = LISTING_TYPES.includes(listingTypeRaw as ListingType)
    ? (listingTypeRaw as ListingType)
    : 'sale';

  const imageUrls = formData
    .getAll('imageUrl')
    .filter((v): v is string => typeof v === 'string')
    .map((u) => u.trim())
    .filter(Boolean);

  const input: Partial<Property> & { title: string; category: 'resell' } = {
    title: title!,
    category: 'resell',
    listingType,
    pricePeriod: listingType === 'rent' ? 'month' : null,
    localitySlug: localitySlug!,
    price: price!,
    bhk: num(formData, 'bhk'),
    bedrooms: num(formData, 'bedrooms'),
    bathrooms: num(formData, 'bathrooms'),
    carpetAreaSqft: num(formData, 'carpetAreaSqft'),
    builtupAreaSqft: num(formData, 'builtupAreaSqft'),
    furnishing: str(formData, 'furnishing') ?? null,
    amenities: csvList(formData, 'amenities'),
    highlights: lineList(formData, 'highlights'),
    reraId: str(formData, 'reraId') ?? null,
    description: str(formData, 'description') ?? '',
    images: imageUrls.map((url) => ({ url, alt: title! })),
    status: 'pending',
    source: 'user',
    ownerId: user.id,
  };

  const created = createProperty(input);

  revalidatePath('/dashboard');
  revalidatePath('/admin/moderation');

  return { ok: true, slug: created.slug };
}
