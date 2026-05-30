'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createLocality, updateLocality, deleteLocality } from '@/lib/data/repo';
import type { Locality } from '@/lib/data/types';

export interface LocalityFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

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

// ─── Build a validated input from form data ───────────────────────────────────

function buildLocalityInput(fd: FormData): {
  data?: Partial<Locality> & { name: string };
  fieldErrors?: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const name = str(fd, 'name');
  if (!name) fieldErrors.name = 'Name is required.';

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const data: Partial<Locality> & { name: string } = {
    name: name!,
    slug: str(fd, 'slug'),
    city: str(fd, 'city') ?? 'Lucknow',
    description: str(fd, 'description') ?? '',
    aiInsights: str(fd, 'aiInsights') ?? '',
    avgPricePerSqft: num(fd, 'avgPricePerSqft') ?? 6000,
    latitude: num(fd, 'latitude') ?? 0,
    longitude: num(fd, 'longitude') ?? 0,
  };

  return { data };
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createLocalityAction(
  _prevState: LocalityFormState,
  formData: FormData,
): Promise<LocalityFormState> {
  const { data, fieldErrors } = buildLocalityInput(formData);
  if (fieldErrors || !data) {
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }

  createLocality(data);
  revalidatePath('/admin/localities');
  revalidatePath('/localities');
  redirect('/admin/localities');
}

export async function updateLocalityAction(
  slug: string,
  _prevState: LocalityFormState,
  formData: FormData,
): Promise<LocalityFormState> {
  const { data, fieldErrors } = buildLocalityInput(formData);
  if (fieldErrors || !data) {
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }

  const updated = updateLocality(slug, data);
  if (!updated) {
    return { error: 'Locality not found.' };
  }

  revalidatePath('/admin/localities');
  revalidatePath('/localities');
  revalidatePath(`/localities/${slug}`, 'page');
  redirect('/admin/localities');
}

export async function deleteLocalityAction(slug: string): Promise<void> {
  deleteLocality(slug);
  revalidatePath('/admin/localities');
  revalidatePath('/localities');
}
