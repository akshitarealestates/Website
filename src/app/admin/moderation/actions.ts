'use server';

import { revalidatePath } from 'next/cache';
import { setPropertyStatus } from '@/lib/data/repo';

export async function approveAction(slug: string): Promise<void> {
  setPropertyStatus(slug, 'published');
  revalidatePath('/admin/moderation');
  revalidatePath('/properties');
}

export async function rejectAction(slug: string, formData: FormData): Promise<void> {
  const reason = (formData.get('reason') as string | null)?.trim() ?? '';
  if (!reason) return;
  setPropertyStatus(slug, 'rejected', reason);
  revalidatePath('/admin/moderation');
  revalidatePath('/properties');
}
