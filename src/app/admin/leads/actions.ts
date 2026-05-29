'use server';

import { revalidatePath } from 'next/cache';
import { updateLeadStatus } from '@/lib/data/repo';
import type { Lead } from '@/lib/data/types';

export async function setLeadStatusAction(
  id: string,
  status: Lead['status'],
): Promise<void> {
  updateLeadStatus(id, status);
  revalidatePath('/admin/leads');
}
