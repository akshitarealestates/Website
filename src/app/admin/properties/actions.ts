'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createProperty,
  updateProperty,
  deleteProperty,
} from '@/lib/data/repo';
import type {
  Property,
  PropertyCategory,
  PropertyStatus,
  ListingType,
  ProjectDetails,
} from '@/lib/data/types';

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

const CATEGORIES: PropertyCategory[] = ['commercial', 'resell', 'premium_project'];
const LISTING_TYPES: ListingType[] = ['sale', 'rent'];
const STATUSES: PropertyStatus[] = ['draft', 'pending', 'published', 'sold', 'rejected'];

// ─── Parsing helpers ───────────────────────────────────────────────────────────

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

/** Split on commas (used for amenities). */
function csvList(fd: FormData, key: string): string[] {
  const v = str(fd, key);
  if (!v) return [];
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Split on newlines (used for highlights). */
function lineList(fd: FormData, key: string): string[] {
  const v = fd.get(key);
  if (typeof v !== 'string') return [];
  return v
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse repeated `images[]` URL rows into PropertyImage[]. */
function parseImages(fd: FormData, title: string) {
  const urls = fd.getAll('imageUrl').filter((v): v is string => typeof v === 'string');
  return urls
    .map((u) => u.trim())
    .filter(Boolean)
    .map((url) => ({ url, alt: title }));
}

/** Parse parallel config row arrays into configurations[]. */
function parseConfigurations(fd: FormData): ProjectDetails['configurations'] {
  const types = fd.getAll('configType').filter((v): v is string => typeof v === 'string');
  const sizes = fd.getAll('configSize').filter((v): v is string => typeof v === 'string');
  const prices = fd.getAll('configPrice').filter((v): v is string => typeof v === 'string');

  const rows: ProjectDetails['configurations'] = [];
  for (let i = 0; i < types.length; i++) {
    const type = (types[i] ?? '').trim();
    const sizeSqft = Number(sizes[i] ?? '');
    const price = Number(prices[i] ?? '');
    if (!type && !Number.isFinite(sizeSqft) && !Number.isFinite(price)) continue;
    rows.push({
      type,
      sizeSqft: Number.isFinite(sizeSqft) ? sizeSqft : 0,
      price: Number.isFinite(price) ? price : 0,
    });
  }
  return rows;
}

// ─── Build a validated patch from form data ─────────────────────────────────────

function buildPropertyInput(fd: FormData): {
  data?: Partial<Property> & { title: string; category: PropertyCategory };
  fieldErrors?: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const title = str(fd, 'title');
  if (!title) fieldErrors.title = 'Title is required.';

  const categoryRaw = str(fd, 'category');
  const category = CATEGORIES.includes(categoryRaw as PropertyCategory)
    ? (categoryRaw as PropertyCategory)
    : undefined;
  if (!category) fieldErrors.category = 'Select a valid category.';

  const price = num(fd, 'price');
  if (price === null || price < 0) fieldErrors.price = 'Enter a valid price.';

  const listingTypeRaw = str(fd, 'listingType');
  const listingType: ListingType = LISTING_TYPES.includes(listingTypeRaw as ListingType)
    ? (listingTypeRaw as ListingType)
    : 'sale';

  const statusRaw = str(fd, 'status');
  const status: PropertyStatus = STATUSES.includes(statusRaw as PropertyStatus)
    ? (statusRaw as PropertyStatus)
    : 'draft';

  const localitySlug = str(fd, 'localitySlug');
  if (!localitySlug) fieldErrors.localitySlug = 'Select a locality.';

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const isPremium = category === 'premium_project';
  let project: ProjectDetails | null = null;
  if (isPremium) {
    const developerName = str(fd, 'developerName');
    if (developerName || str(fd, 'possessionDate') || fd.getAll('configType').length > 0) {
      project = {
        developerName: developerName ?? '',
        possessionDate: str(fd, 'possessionDate') ?? '',
        projectStatus: str(fd, 'projectStatus'),
        totalUnits: num(fd, 'totalUnits') ?? undefined,
        configurations: parseConfigurations(fd),
        amenitiesExtended: [],
      };
    }
  }

  const data: Partial<Property> & { title: string; category: PropertyCategory } = {
    title: title!,
    category: category!,
    listingType,
    price: price!,
    pricePeriod: listingType === 'rent' ? str(fd, 'pricePeriod') ?? 'month' : null,
    bhk: num(fd, 'bhk'),
    bedrooms: num(fd, 'bedrooms'),
    bathrooms: num(fd, 'bathrooms'),
    carpetAreaSqft: num(fd, 'carpetAreaSqft'),
    builtupAreaSqft: num(fd, 'builtupAreaSqft'),
    furnishing: str(fd, 'furnishing') ?? null,
    floor: num(fd, 'floor'),
    totalFloors: num(fd, 'totalFloors'),
    localitySlug: localitySlug!,
    address: str(fd, 'address') ?? null,
    latitude: num(fd, 'latitude'),
    longitude: num(fd, 'longitude'),
    amenities: csvList(fd, 'amenities'),
    reraId: str(fd, 'reraId') ?? null,
    description: str(fd, 'description') ?? '',
    highlights: lineList(fd, 'highlights'),
    status,
    isFeatured: fd.get('isFeatured') === 'on',
    images: parseImages(fd, title!),
    project,
  };

  return { data };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function createPropertyAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { data, fieldErrors } = buildPropertyInput(formData);
  if (fieldErrors || !data) {
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }

  createProperty(data);
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
  redirect('/admin/properties');
}

export async function updatePropertyAction(
  slug: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { data, fieldErrors } = buildPropertyInput(formData);
  if (fieldErrors || !data) {
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }

  const updated = updateProperty(slug, data);
  if (!updated) {
    return { error: 'Property not found.' };
  }

  revalidatePath('/admin/properties');
  revalidatePath('/properties');
  revalidatePath(`/properties/${slug}`);
  redirect('/admin/properties');
}

export async function deletePropertyAction(slug: string): Promise<void> {
  deleteProperty(slug);
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
}
